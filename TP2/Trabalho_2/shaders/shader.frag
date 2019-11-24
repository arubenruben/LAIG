#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;


//Fragment shader

void main(){
    
    vec4 color = texture2D(uSampler,vTextureCoord);
    vec2 origem = vec2(0.5,0.5);

    float distance = distance(origem, vTextureCoord);
    
    // Circular gradient calculation
    float value = 1.0 - (distance * 1.7);

    // Trying to make a different function to improve the circular gradient (NOT COMPLETE)
    //    vec4 color = texture2D(uSampler,vTextureCoord);
    // vec2 origem = vec2(0.5,0.5);
    // float distance = distance(origem, vTextureCoord);

    // float r = 0.5 * sqrt(2.0);
    // float f = -(vTextureCoord.x - (r/2.0)) * (vTextureCoord.x - (r/2.0)) + (r/2.0) * (r/2.0);
    // float h = f * 1.6 + vTextureCoord.x;
    // float d = h * (1.0/r);
    // float value = 1.0 - d;

    // Makes the white lines that are moving one the security camera
    // if(mod(vTextureCoord.y * 20.0- timeFactor / 10.0, 2.0) > 1.0)
    //     color = vec4(color.rgb + 0.3,1.0);

    // gl_FragColor = vec4(color.rgb * value, 1.0);


    // Makes the white lines that are moving one the security camera
    if(mod(vTextureCoord.y * 20.0- timeFactor / 10.0, 2.0) > 1.0)
        color = vec4(color.rgb + 0.3,1.0);

    gl_FragColor = vec4(color.rgb * value, 1.0);


}









    
