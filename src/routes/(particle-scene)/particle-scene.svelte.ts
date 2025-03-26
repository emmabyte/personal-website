import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

// Particle settings
const avgParticleSpeed = 0.6;
const particleCount = 500;
const depthRange = 4000;

// Depth of Field (bokeh) settings
const aperture = 0.000003;
// const maxblur = 0.025;
const maxblur = 0.001;

// Calculated Shared Variables
const deltaZ = depthRange;
const maxZ = deltaZ / 5; // max z shifted up by 1/5 above z=0
const minZ = (-4 * deltaZ) / 5;

type SceneState = {
	camera: THREE.PerspectiveCamera | null;
	composer: EffectComposer | null;
	keywordStrings: string[] | null;
	keywords: THREE.Group | null;
	particles: THREE.Points | null;
	particleSpeeds: number[] | null;
	positions: Float32Array | null;
	renderer: THREE.WebGLRenderer | null;
	scene: THREE.Scene | null;
};

interface BokehUniforms {
	focus: { value: number };
	aperture: { value: number };
	maxblur: { value: number };
}

export const sceneState = $state<SceneState>({
	camera: null,
	composer: null,
	keywords: null,
	keywordStrings: null,
	particles: null,
	particleSpeeds: null,
	positions: null,
	renderer: null,
	scene: null
});

function createCamera() {
	const fov = 75;
	const aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
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
	sceneState.renderer.setSize(
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	);
	sceneState.renderer.setPixelRatio(window.devicePixelRatio);

	sceneState.composer = new EffectComposer(sceneState.renderer);

	if (!sceneState.scene || !sceneState.camera) {
		throw new Error('Scene or camera not found');
	}

	const renderPass = new RenderPass(sceneState.scene, sceneState.camera);
	sceneState.composer.addPass(renderPass);

	const bokehPass = new BokehPass(sceneState.scene, sceneState.camera, {
		focus: Math.abs(sceneState.camera.position.z) + 50,
		aperture,
		maxblur
	});
	sceneState.composer.addPass(bokehPass);
}

function createParticles() {
	const positions = new Float32Array(particleCount * 3);
	const particleSpeeds: number[] = new Array(particleCount);
	const opacities = new Float32Array(particleCount);
	const halfWidth = document.documentElement.clientWidth / 2;
	const halfHeight = document.documentElement.clientHeight / 2;

	for (let i = 0; i < particleCount; i += 1) {
		positions[i * 3 + 0] = Math.random() * document.documentElement.clientWidth - halfWidth;
		positions[i * 3 + 1] = Math.random() * document.documentElement.clientHeight - halfHeight;
		positions[i * 3 + 2] = Math.random() * -deltaZ + deltaZ / 5;

		const speedNoiseConstant = Math.random() - 0.5;
		const speedNoiseMultiplier = 2;
		particleSpeeds[i] =
			avgParticleSpeed + avgParticleSpeed * speedNoiseConstant * speedNoiseMultiplier;

		// We want to map our z coord from 0->1 (from math.random) to (deltaZ/5)->-4deltaZ/5
		// This ensures particles spawn in the range of the depthRange, shifted up by 1/5

		const depthFactor = (positions[i * 3 + 2] + depthRange / 5) / depthRange;
		opacities[i] = 1.0 - depthFactor;
	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('alpha', new THREE.BufferAttribute(opacities, 1));

	const material = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true,
		depthTest: false,
		vertexColors: false, // Since we're using a custom alpha attribute, we don't need this
		blending: THREE.AdditiveBlending
	});

	sceneState.particles = new THREE.Points(geometry, material);
	sceneState.particleSpeeds = particleSpeeds;
	sceneState.scene?.add(sceneState.particles);
}

function createTextTexture(text: string) {
	const canvas = document.createElement('canvas');
	const scaleFactor = 0.7;

	canvas.height = document.documentElement.clientHeight * scaleFactor;
	canvas.width = canvas.height * 2;

	const context = canvas.getContext('2d');

	if (!context) {
		throw new Error('Canvas context not found');
	}

	context.font = '600 80px "Pixelify Sans", sans-serif';

	context.fillStyle = 'white';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText(text, canvas.width / 2, canvas.height / 2);

	const texture = new THREE.CanvasTexture(canvas);
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;

	return texture;
}

function createKeywordSprite(text: string) {
	const texture = createTextTexture(text);
	const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
	const sprite = new THREE.Sprite(material);
	sprite.scale.set(100, 50, 1);
	return sprite;
}

function createKeywords() {
	if (!sceneState.scene || !sceneState.keywordStrings) {
		throw new Error('Scene not found');
	}

	sceneState.keywords = new THREE.Group();

	sceneState.keywordStrings.forEach((keyword) => {
		const sprite = createKeywordSprite(keyword);
		sprite.position.x =
			(Math.random() * document.documentElement.clientWidth) / 3 -
			document.documentElement.clientWidth / 6;
		sprite.position.y =
			(Math.random() * document.documentElement.clientHeight) / 3 -
			document.documentElement.clientHeight / 6;
		sprite.position.z = Math.random() * deltaZ - deltaZ / 5;
		// sprite.position.z = 0;

		sceneState.keywords?.add(sprite);
	});

	sceneState.scene.add(sceneState.keywords);
}

function animateParticles() {
	if (!sceneState.particles || !sceneState.camera || !sceneState.particleSpeeds) {
		throw new Error('Particles or camera not found');
	}
	const posAttr = sceneState.particles.geometry.attributes.position;
	const alphaAttr = sceneState.particles.geometry.attributes.alpha as THREE.BufferAttribute;
	alphaAttr.setUsage(THREE.DynamicDrawUsage);

	const cameraZ = sceneState.camera.position.z;

	for (let i = 0; i < particleCount; i++) {
		const j = i * 3;
		// posAttr.array[j + 2] -= avgParticleSpeed;
		posAttr.array[j + 2] -= sceneState.particleSpeeds[i];
		if (posAttr.array[j + 2] < minZ) {
			posAttr.array[j + 2] = maxZ;
		}

		const depthFactor = (posAttr.array[j + 2] - cameraZ) / (maxZ - minZ);
		alphaAttr.array[i] = Math.max(0.0, Math.min(1.0, 1.0 - depthFactor));
	}
	posAttr.needsUpdate = true;
	alphaAttr.needsUpdate = true;
}

function animateKeywords() {
	if (!sceneState.keywords || !sceneState.camera) {
		throw new Error('Keywords or camera not found');
	}

	sceneState.keywords.children.forEach((keyword) => {
		keyword.position.z -= avgParticleSpeed / 3;
		if (keyword.position.z < minZ) {
			keyword.position.z = maxZ;
		}
	});
}

function updateBokehFocus() {
	if (!sceneState.composer || !sceneState.camera) return;
	const bokehPass = sceneState.composer.passes.find(
		(pass) => pass instanceof BokehPass
	) as BokehPass;
	if (!bokehPass) return;

	const uniforms = (bokehPass as BokehPass).uniforms as unknown as BokehUniforms;
	uniforms.focus.value = Math.abs(sceneState.camera!.position.z) + 50;
}

function animate() {
	requestAnimationFrame(animate);
	animateKeywords();
	animateParticles();
	updateBokehFocus();

	if (!sceneState.renderer || !sceneState.scene || !sceneState.camera || !sceneState.composer) {
		throw new Error('Scene not found');
	}

	// sceneState.renderer.render(sceneState.scene, sceneState.camera);
	sceneState.composer.render();
}

function onWindowResize() {
	if (!sceneState.camera || !sceneState.renderer) {
		throw new Error('Camera or renderer not found');
	}
	sceneState.camera.aspect =
		document.documentElement.clientWidth / document.documentElement.clientHeight;
	sceneState.camera.updateProjectionMatrix();
	sceneState.renderer?.setSize(
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	);
	sceneState.composer?.setSize(
		document.documentElement.clientWidth,
		document.documentElement.clientHeight
	);
}

export function initParticleScene(canvas: HTMLCanvasElement, keywords: string[]) {
	sceneState.scene = new THREE.Scene();
	sceneState.keywordStrings = keywords;
	createCamera();
	createRenderer(canvas);
	createParticles();
	createKeywords();
	animate();
	window.addEventListener('resize', onWindowResize);
}
