
export default function createPlayerModel(){
    let root = new Group({name: 'Root', origin: [0, 0, 0], isOpen: true}).init();
    let hips = new Group({name: "Hips", origin: [0, 11.25, 0], isOpen: true}).addTo(root).init();
    let torso = new Group({name: "TR", origin: [0, 11.25, 0], isOpen: true}).addTo(hips).init();
    let bodyCube = new Cube({name: "Body", from: [-3.75, 11.25, -1.875], to: [3.75, 22.5, 1.875], uv_offset: [16, 16]}).addTo(torso).init();
    let head = new Group({name: "HD", origin: [0, 22.25, 0], isOpen: true}).addTo(torso).init();
    let headCube = new Cube({name: "Head", from: [-3.75, 22.5, -3.75], to: [3.75, 30, 3.75], uv_offset: [0, 0]}).addTo(head).init();
    let right_arm = new Group({name: "RA", origin: [4.6875, 20.625, 0], isOpen: true}).addTo(torso).init();
    let right_armCube = new Cube({name: "Right Arm", from: [3.75, 11.25, -1.875], to: [7.5, 22.5, 1.875], uv_offset: [40, 16]}).addTo(right_arm).init();
    let left_arm = new Group({name: "LA", origin: [-4.6875, 20.625, 0], isOpen: true}).addTo(torso).init();
    let left_armCube = new Cube({name: "Left Arm", from: [-7.5, 11.25, -1.875], to: [-3.75, 22.5, 1.875], uv_offset: [32, 48]}).addTo(left_arm).init();
    let right_leg = new Group({name: "RL", origin: [1.7813, 11.25, 0.0938], isOpen: true}).addTo(hips).init();
    let right_legCube = new Cube({name: "Right Leg", from: [-0.09375, 0, -1.78125], to: [3.65625, 11.25, 1.96875], uv_offset: [0, 16]}).addTo(right_leg).init();
    let left_leg = new Group({name: "LL", origin: [-1.7813, 11.25, 0.0938], isOpen: true}).addTo(hips).init();
    let left_legCube = new Cube({name: "Left Leg", from: [-3.65625, 0, -1.78125], to: [0.09375, 11.25, 1.96875], uv_offset: [16, 48]}).addTo(left_leg).init();
}