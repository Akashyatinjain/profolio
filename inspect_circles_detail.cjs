const fs = require('fs');

const buf = fs.readFileSync('public/models/porsche_911.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonChunk = buf.subarray(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonChunk);

console.log('Nodes matching Circle:');
gltf.nodes.forEach((n, idx) => {
  if (n.name && (n.name.includes('Circle.017') || n.name.includes('Circle.011') || n.name.includes('Circle.008') || n.name.includes('Circle.007') || n.name.includes('Circle.025') || n.name.includes('Circle.016') || n.name.includes('Circle.013') || n.name.includes('Circle.034') || n.name.includes('Circle.031'))) {
    console.log(`Node ${idx}: "${n.name}", mesh index: ${n.mesh}, trans: ${JSON.stringify(n.translation)}`);
    if (n.mesh !== undefined) {
      const m = gltf.meshes[n.mesh];
      console.log(`  Mesh: "${m.name}", primitives: ${m.primitives.length}`);
      m.primitives.forEach((p, pIdx) => {
        const mat = gltf.materials ? gltf.materials[p.material] : null;
        console.log(`    Prim ${pIdx}: mat: "${mat ? mat.name : 'none'}", attrs: ${Object.keys(p.attributes).join(', ')}`);
      });
    }
  }
});
