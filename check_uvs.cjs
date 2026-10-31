const fs = require('fs');

const buf = fs.readFileSync('public/models/porsche_911.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonChunk = buf.subarray(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonChunk);
const binChunk = buf.subarray(28 + jsonLen);

function getAccessorData(accIdx) {
  const acc = gltf.accessors[accIdx];
  const bv = gltf.bufferViews[acc.bufferView];
  const offset = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  return { acc, bv, slice: binChunk.subarray(offset, offset + bv.byteLength) };
}

[55, 59, 58, 54, 7, 3, 4, 5].forEach(nodeIdx => {
  const node = gltf.nodes[nodeIdx];
  if (node.mesh === undefined) return;
  const mesh = gltf.meshes[node.mesh];
  const prim = mesh.primitives[0];
  const uvAccIdx = prim.attributes.TEXCOORD_0;
  if (uvAccIdx !== undefined) {
    const acc = gltf.accessors[uvAccIdx];
    console.log(`Node ${nodeIdx} (${node.name}): Mesh "${mesh.name}" UV: min=[${acc.min}], max=[${acc.max}]`);
  }
});
