attribute float alpha;
varying float vAlpha;

void main() {
			// Get camera distance from the particle
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
	float distanceFactor = 1.0 / -mvPosition.z; // Inverse depth scaling

			// Scale the point size based on distance
	float baseSize = 20.0; // Larger pixel size
	gl_PointSize = baseSize * distanceFactor * 100.0;
	gl_PointSize = max(gl_PointSize, 1.0); // Prevent tiny particles

			// Opacity adjustment based on depth
	float minDepth = -1000.0; // Adjust based on scene depth
	float maxDepth = 0.0; // Near the camera
	float fadeFactor = clamp((mvPosition.z - minDepth) / (maxDepth - minDepth), 0.0, 1.0);

	vAlpha = alpha * fadeFactor; // Apply fade based on depth

	gl_Position = projectionMatrix * mvPosition;
}