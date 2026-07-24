param(
  [string]$Root = "$PSScriptRoot\..\prototypes",
  [int]$Port = 4599
)

$Root = (Resolve-Path $Root).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Serving $Root on http://127.0.0.1:$Port/"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $request = $context.Request
  $response = $context.Response
  try {
    # Use RawUrl + manual decode instead of $request.Url.LocalPath — .NET's Uri parser
    # mishandles %23 (#) by treating the decoded '#' as a fragment separator and truncating
    # the path, which breaks any folder/file name containing '#' (e.g. "Iteration #02_...").
    $rawPath = $request.RawUrl
    $queryIndex = $rawPath.IndexOf('?')
    if ($queryIndex -ge 0) { $rawPath = $rawPath.Substring(0, $queryIndex) }
    $relPath = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($relPath)) { $relPath = "index.html" }
    $filePath = Join-Path $Root $relPath

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = switch ($ext) {
        ".html" { "text/html; charset=utf-8" }
        ".css"  { "text/css" }
        ".js"   { "application/javascript" }
        ".svg"  { "image/svg+xml" }
        ".png"  { "image/png" }
        ".jpg"  { "image/jpeg" }
        default { "application/octet-stream" }
      }
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $contentType
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $notFound = [System.Text.Encoding]::UTF8.GetBytes("Not found: $relPath")
      $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
  } catch {
    $response.StatusCode = 500
  } finally {
    $response.OutputStream.Close()
  }
}
