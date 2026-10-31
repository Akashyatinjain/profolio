import bpy
import mathutils

print("=== CHECKING WHEEL & TIRE GEOMETRY ===")
blend_path = "c:/portfolio/free-1975-porsche-911-930-turbo/source/911_scene.blend"
bpy.ops.wm.open_mainfile(filepath=blend_path)

wheel_meshes = []
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        mats = [s.material.name for s in obj.material_slots if s.material]
        if any('tire' in m.lower() or 'rim' in m.lower() for m in mats):
            wheel_meshes.append(obj)

print(f"Found {len(wheel_meshes)} wheel/tire objects:")
lowest_tire_z = float('inf')
for obj in wheel_meshes:
    mat = obj.matrix_world
    min_z = min((mat @ mathutils.Vector(v)).z for v in obj.bound_box)
    max_z = max((mat @ mathutils.Vector(v)).z for v in obj.bound_box)
    min_y = min((mat @ mathutils.Vector(v)).y for v in obj.bound_box)
    max_y = max((mat @ mathutils.Vector(v)).y for v in obj.bound_box)
    min_x = min((mat @ mathutils.Vector(v)).x for v in obj.bound_box)
    max_x = max((mat @ mathutils.Vector(v)).x for v in obj.bound_box)
    print(f"  {obj.name}: Z=[{min_z:.4f}, {max_z:.4f}], Y=[{min_y:.4f}, {max_y:.4f}], X=[{min_x:.4f}, {max_x:.4f}]")
    lowest_tire_z = min(lowest_tire_z, min_z)

print(f"\nLowest tire contact point in Blender Z: {lowest_tire_z:.4f}")

# Check chassis / bumper lowest Z
all_lowest_z = float('inf')
lowest_obj = ""
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        mat = obj.matrix_world
        min_z = min((mat @ mathutils.Vector(v)).z for v in obj.bound_box)
        if min_z < all_lowest_z:
            all_lowest_z = min_z
            lowest_obj = obj.name

print(f"Absolute lowest point of all objects in Blender: {all_lowest_z:.4f} (Object: {lowest_obj})")
