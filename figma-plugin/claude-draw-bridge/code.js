figma.showUI(__html__, { width: 340, height: 320 });

const DEFAULT_FONT = { family: 'Inter', style: 'Regular' };

function hexToRgb(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

async function loadFontSafe(fontFamily, fontStyle) {
  const attempts = [
    { family: fontFamily || DEFAULT_FONT.family, style: fontStyle || DEFAULT_FONT.style },
    { family: fontFamily || DEFAULT_FONT.family, style: 'Regular' },
    DEFAULT_FONT,
  ];
  for (const font of attempts) {
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch (e) {
      // try next fallback
    }
  }
  await figma.loadFontAsync(DEFAULT_FONT);
  return DEFAULT_FONT;
}

function applyCommonProps(node, cmd) {
  if (typeof cmd.x === 'number') node.x = cmd.x;
  if (typeof cmd.y === 'number') node.y = cmd.y;
  if (cmd.name) node.name = cmd.name;
  if (typeof cmd.opacity === 'number') node.opacity = cmd.opacity;
  if (typeof cmd.rotation === 'number' && 'rotation' in node) node.rotation = cmd.rotation;
  if (cmd.fill && 'fills' in node) {
    node.fills = [{ type: 'SOLID', color: hexToRgb(cmd.fill) }];
  }
  if (cmd.stroke && 'strokes' in node) {
    node.strokes = [{ type: 'SOLID', color: hexToRgb(cmd.stroke) }];
    if (typeof cmd.strokeWidth === 'number') node.strokeWeight = cmd.strokeWidth;
  }
  if (typeof cmd.cornerRadius === 'number' && 'cornerRadius' in node) {
    node.cornerRadius = cmd.cornerRadius;
  }
}

async function createNode(cmd, parentFrame, idMap) {
  let node;

  switch (cmd.type) {
    case 'rectangle': {
      node = figma.createRectangle();
      node.resize(cmd.width || 100, cmd.height || 100);
      applyCommonProps(node, cmd);
      break;
    }
    case 'ellipse': {
      node = figma.createEllipse();
      node.resize(cmd.width || 100, cmd.height || 100);
      applyCommonProps(node, cmd);
      break;
    }
    case 'line': {
      node = figma.createLine();
      node.resize(cmd.width || 100, 0);
      applyCommonProps(node, cmd);
      break;
    }
    case 'text': {
      node = figma.createText();
      const font = await loadFontSafe(cmd.fontFamily, cmd.fontWeight);
      node.fontName = font;
      node.characters = cmd.characters || '';
      if (typeof cmd.fontSize === 'number') node.fontSize = cmd.fontSize;
      applyCommonProps(node, cmd);
      if (typeof cmd.width === 'number') {
        node.textAutoResize = 'HEIGHT';
        node.resize(cmd.width, node.height);
      }
      break;
    }
    case 'frame': {
      node = figma.createFrame();
      node.resize(cmd.width || 200, cmd.height || 200);
      applyCommonProps(node, cmd);
      if (!cmd.fill) node.fills = [];
      break;
    }
    default:
      figma.notify(`Unknown command type: ${cmd.type}`);
      return null;
  }

  if (cmd.id) idMap[cmd.id] = node;

  const parent = (cmd.parent && idMap[cmd.parent]) || parentFrame || figma.currentPage;
  parent.appendChild(node);

  return node;
}

async function runCommands(payload) {
  const { batchName, commands } = payload;
  const name = batchName || 'Claude Draw Batch';

  // remove previous batch with the same name so re-running doesn't pile up duplicates
  const existing = figma.currentPage.findOne(n => n.name === name && n.type === 'FRAME');
  if (existing) existing.remove();

  const root = figma.createFrame();
  root.name = name;
  root.resize(1600, 1200);
  root.fills = [];
  figma.currentPage.appendChild(root);

  const idMap = {};
  let count = 0;

  for (const cmd of commands || []) {
    try {
      await createNode(cmd, root, idMap);
      count++;
    } catch (e) {
      figma.ui.postMessage({ pluginMessage: { type: 'result', ok: false, text: `Command failed (${cmd.type}): ${e.message}` } });
    }
  }

  figma.viewport.scrollAndZoomIntoView([root]);
  figma.ui.postMessage({ pluginMessage: { type: 'result', ok: true, text: `Drew ${count} node(s) into "${name}"` } });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'run-commands') {
    await runCommands(msg.payload);
  }
  if (msg.type === 'clear-batch') {
    const existing = figma.currentPage.findOne(n => n.name === (msg.batchName || 'Claude Draw Batch') && n.type === 'FRAME');
    if (existing) {
      existing.remove();
      figma.ui.postMessage({ pluginMessage: { type: 'result', ok: true, text: 'Cleared last batch' } });
    } else {
      figma.ui.postMessage({ pluginMessage: { type: 'result', ok: true, text: 'Nothing to clear' } });
    }
  }
};
