const fs = require('fs');
const gltfPath = 'public/models/porsche_911.glb';

// Let's use GLTFLoader in node if possible, or parse the JSON chunk of GLB
const buf = fs.readFileSync(gltfPath);
const jsonLength = buf.readUInt32LE(12);
const jsonChunk = buf.subarray(20, 20 + jsonLength).toString('utf8');
const gltf = JSON.parse(jsonChunk);

console.log('=== GLTF NODES & MESHES ===');
gltf.nodes.forEach((node, i) => {
  let meshInfo = '';
  if (node.mesh !== undefined) {
    const mesh = gltf.meshes[node.mesh];
    const primitives = mesh.primitives.map(p => {
      const mat = gltf.materials ? gltf.materials[p.material] : null;
      return mat ? mat.name : 'no-mat';
    }).join(', ');
    meshInfo = `mesh[${node.mesh}]: ${mesh.name} (mat: ${primitives})`;
  }
  const trans = node.translation ? `pos: [${node.translation.map(n => n.toFixed(2)).join(', ')}]` : '';
  console.log(`Node ${i}: "${node.name}" ${meshInfo} ${trans}`);
});

console.log('\n=== MATERIALS ===');
if (gltf.materials) {
  gltf.materials.forEach((m, i) => {
    console.log(`Mat ${i}: "${m.name}"`);
  });
}
