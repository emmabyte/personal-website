varying float vAlpha;

void main() {
    if(vAlpha <= 0.0)
        discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
}