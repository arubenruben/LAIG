#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

//Fragment shader

void main(){
    
    /*
    vec4 color =texture2D(uSampler,vTextureCoord);

    if(vTextureCoord.x <= 0.5 && vTextureCoord.y <= 0.5)
        gl_FragColor = vec4(color.rgb * vTextureCoord.x * 2.0 * vTextureCoord.y * 2.0, 1.0);

    if(vTextureCoord.x <= 0.5 && vTextureCoord.y > 0.5)
    gl_FragColor = vec4(color.rgb * vTextureCoord.x * 2.0, 1.0);

    if(vTextureCoord.x > 0.5 && vTextureCoord > 0.5)
        gl_FragColor = vec4(color.rgb * (1.0 - vTextureCoord.x) * 2.0, 1.0);

     if(vTextureCoord.x > 0.5 && vTextureCoord <= 0.5)
        gl_FragColor = vec4(color.rgb * (1.0 - vTextureCoord.x) * 2.0, 1.0);
    
    */

}









    
