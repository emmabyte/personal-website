import { cameraZStart } from './particle-scene.svelte';

// Lots of math going on here. Here's the breakdown:
// 1. let f(gamma,beta) where gamma = scrollPos and beta = canvas end position
//    f(gamma,beta) = (max(0, min(gamma, beta)) / beta )
//    this gives a value between 0 and 1, which is the progress we've scrolled up to the window height
//    To map this to a rotation value, we multiply by the max rotation value
//    => phi = f(gamma,beta) = max_rotation_radians * (max(0, min(gamma, beta)) / beta )
// 2. We then need rho, the radius of the circle we are orbiting around. Since we're only rotating
//    around the y axis, we can use the camera's z position as the radius.
//    => rho = z_cam
// 3. We can then use the radius and the rotation value to get the x and y coordinates of the camera
//    => x = rho * sin(phi)
//    => y = rho * cos(phi)
// 4. Finally, this gives us a total of three functions, based on three variables (and 1 paramter)
//    f(gamma, beta) = max_rotation_radians * (max(0, min(gamma, beta)) / beta )
//    x = z_cam * sin(f(gamma, beta))
//    z = z_cam * cos(f(gamma, beta))
export function getXYFromScroll(
	scrollPos: number,
	canvasEndPos: number,
	maxRotationRadians: number
) {
	const round = (num: number) => Math.round(num * 100) / 100;

	const f = (gamma: number, beta: number) => {
		return round(maxRotationRadians * (Math.max(0, Math.min(gamma, beta)) / beta));
	};

	const phi = f(scrollPos, canvasEndPos);
	const rho = cameraZStart; // Should only be the initial z position of the camera

	const x = rho * Math.sin(phi);
	const z = rho * Math.cos(phi);

	return { x: round(x), z: round(z) };
}
