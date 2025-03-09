import * as THREE from 'three';

// Default Params
const particleSpeed = 0.5;
const particleCount = 1000;
const depthRange = 2000;

type SceneState = {
	camera: THREE.PerspectiveCamera | null;
	scene: THREE.Scene | null;
	renderer: THREE.WebGLRenderer | null;
	particles: THREE.Points | null;
	positions: Float32Array | null;
};

export const sceneState = $state<SceneState>({
	camera: null,
	scene: null,
	renderer: null,
	particles: null,
	positions: null
});

function createCamera() {
	const fov = 75;
	const aspect = window.innerWidth / window.innerHeight;
	const near = 1;
	const far = 1000;
	sceneState.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	sceneState.camera.position.z = 0;
	sceneState.camera.lookAt(new THREE.Vector3(0, 0, -1));
}

function createRenderer(canvas: HTMLCanvasElement) {
	if (!canvas) {
		throw new Error('Canvas not found');
	}
	if (!window) {
		throw new Error('Window object not found');
	}

	sceneState.renderer = new THREE.WebGLRenderer({ canvas });
	sceneState.renderer.setSize(window.innerWidth, window.innerHeight);
	sceneState.renderer.setPixelRatio(window.devicePixelRatio);
}

function createParticles() {
	const positions = new Float32Array(particleCount * 3);
	const halfWidth = window.innerWidth / 2;
	const halfHeight = window.innerHeight / 2;

	for (let i = 0; i < particleCount; i += 1) {
		positions[i * 3 + 0] = Math.random() * window.innerWidth - halfWidth;
		positions[i * 3 + 1] = Math.random() * window.innerHeight - halfHeight;
		positions[i * 3 + 2] = Math.random() * depthRange - depthRange / 5;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

	const material = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 2,
		transparent: true,
		opacity: 0.8
	});

	sceneState.particles = new THREE.Points(geometry, material);
	sceneState.scene?.add(sceneState.particles);
}

function animateParticles() {
	if (!sceneState.particles) {
		throw new Error('Particles not found');
	}
	const posAttr = sceneState.particles.geometry.attributes.position;
	const minZ = 0 - depthRange / 5;
	const maxZ = depthRange - depthRange / 5;

	for (let i = 0; i < particleCount; i++) {
		const j = i * 3;
		posAttr.array[j + 2] -= particleSpeed;
		if (posAttr.array[j + 2] < minZ) {
			posAttr.array[j + 2] = maxZ;
		}
	}
	posAttr.needsUpdate = true;
}

function animate() {
	requestAnimationFrame(animate);
	animateParticles();

	if (!sceneState.renderer || !sceneState.scene || !sceneState.camera) {
		throw new Error('Scene not found');
	}

	sceneState.renderer.render(sceneState.scene, sceneState.camera);
}

function onWindowResize() {
	if (!sceneState.camera || !sceneState.renderer) {
		throw new Error('Camera or renderer not found');
	}
	sceneState.camera.aspect = window.innerWidth / window.innerHeight;
	sceneState.camera.updateProjectionMatrix();
	sceneState.renderer?.setSize(window.innerWidth, window.innerHeight);
}

export function initParticleScene(canvas: HTMLCanvasElement) {
	sceneState.scene = new THREE.Scene();
	createCamera();
	createRenderer(canvas);
	createParticles();
	animate();
	window.addEventListener('resize', onWindowResize);
}
