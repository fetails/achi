/* WebGL Context Ptr */
let gl = null;
let vs_code = null;

class AchiColor
{
    /**
     * 
     * @param {Number} red 
     * @param {Number} green 
     * @param {Number} blue 
     * @param {Number} alpha 
     */
    constructor(red, green, blue, alpha)
    {
        this.r = red / 255;
        this.g = green / 255;
        this.b = blue / 255;
        this.a = alpha / 255;
    }
}

class AchiShader
{
    /**
     * @param {String} vertex - Vertex Shader ID
     * @param {String} fragment - Fragment Shader ID
     */
    constructor(vertex = null, fragment = null)
    {
        if(vertex !== null && fragment !== null)
        {
            this.vertex = vertex;
            this.fragment = fragment;

            let vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, this.vertex);
            gl.compileShader(vs);
            if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
            {
                console.error("Vertex", gl.getShaderInfoLog(vs));
                return;
            } else {
                console.info("%c[AchiShader]%c Vertex has been compiled.", "color:#54B673;", "color:#A454B6;");
            }

            let fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, this.fragment);
            gl.compileShader(fs);
            if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
            {
                console.error("Fragment", gl.getShaderInfoLog(fs));
                return;
            } else {
                console.info("%c[AchiShader]%c Fragment has been compiled.", "color:#54B673;", "color:#A454B6;");
            }

            let prog = gl.createProgram();
            console.info("%c[AchiShader]%c Program has been created.", "color:#54B673;", "color:#A454B6;");
            
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            console.info("%c[AchiShader]%c Shader has been attached.", "color:#54B673;", "color:#A454B6;");

            gl.linkProgram(prog);
            console.info("%c[AchiShader]%c Program has been linked.", "color:#54B673;", "color:#A454B6;");
            
            gl.validateProgram(prog);
            console.info("%c[AchiShader]%c Program has been validated.", "color:#54B673;", "color:#A454B6;");
           
            gl.deleteShader(vs);
            gl.deleteShader(fs);

            console.info("%c[AchiShader]%c Shaders has been deleted.\nWe don't need them anymore as we have the program.", "color:#54B673;", "color:#A454B6;");

            this.program = prog;
        } else {
            console.error("[AchiShader] Null!\nMissing parameters.\n\nUsage: let myVar = new AchiShader(parameter1, parameter2);");
        }
    }

    /**
     * 
     * @param {String} location - Uniform Location
     */
    get_location(location = null)
    {
        if( location === null )
            console.error("[AchiShader] Expected atleast 1 parameter for get_location();");
        else
            return gl.getUniformLocation(this.program, location);
    }
    /**
     * 
     * @param {String} name 
     * @param {mat4} val 
     */
    uniform_mat4(name, val)
    {
        gl.uniformMatrix4fv(this.get_location(name), gl.FALSE, val);
    }
    /**
     * 
     * @param {String} name 
     * @param {vec2} val 
     */
    uniform_vec2(name, val)
    {
        gl.uniform2fv(this.get_location(name), val);
    }
    /**
     * 
     * @param {String} name 
     * @param {vec3} val 
     */
    uniform_vec3(name, val)
    {
        gl.uniform3fv(this.get_location(name), val);
    }
    /**
     * 
     * @param {String} name 
     * @param {vec4} val 
     */
    uniform_vec4(name, val)
    {
        gl.uniform4fv(this.get_location(name), val);
    }
    set_bind()
    {
        gl.useProgram(this.program);
    }
    set_unbind()
    {
        gl.useProgram(0);
    }
    /**
     * 
     * @param {String} location - URL Destination.
     * @param {Function} cb - Callback (Function to call after dest has been reached.)
     */
    request(location = null, cb = null )
    {
        if(location !== null)
        {
            let xml = new XMLHttpRequest();

            xml.open("GET", location);
            xml.onload = function()
            {
                if(xml.status < 200 && xml.status > 299)
                {
                    cb("error!");
                } else {
                    cb(null, xml.responseText);
                }
            }
            xml.send();
        } else {
            console.error("[Achi] Missing URL parameter");
        }
    }
}

class AchiEngine
{
    /**
     * 
     * @param {String} context - Canvas ID: Ex "#myCanvas"
     */
    constructor(context)
    {
        this.buffer = [];
        this.indices = [];
        this.mx = 0;
        this.my = 0;

        this.canvas = document.querySelector(context);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        gl = this.canvas.getContext("webgl2");

        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        if(!gl)
        {
            console.info("%c[Achi]%c WebGL2 could not load.", "color:#54B673;", "color:#C64747;");
            return;
        }
        console.info("%c[Achi]%c Achi has been loaded.", "color:#54B673;", "color:#A454B6;");
    }
    /**
     * @param {AchiColor} clearColor - Clear color
     */
    clear(clearColor = new AchiColor(25, 25, 25, 255))
    {
        gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
    mousecoords()
    {
        window.addEventListener("mousemove", (e) => {
            this.mx = e.clientX;
            this.my = e.clientY;
        });
    }
    /**
     * This will make the canvas more responsive.
     */
    addbuffer(v, i)
    {
        this.buffer.push(v);
        this.indices.push(i);
    }
    quad2d(x, y, w, h)
    {
        this.addbuffer([
            x, y, 0.0,
            x, y + h, 0.0,
            x + w, y, 0.0,
            x + w, y + h, 0.0
        ],
        [
            0, 1, 2,
            3, 2, 1
        ]);
    }
    setup()
    {
        let i = [].concat.apply([], this.indices);
        let v = [].concat.apply([], this.buffer);
        this.vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(0);
    }

    render()
    {
        let i = [].concat.apply([], this.indices);
        gl.drawElements(gl.TRIANGLES, i.length, gl.UNSIGNED_SHORT, 0);
    }

    get w()
    {
        return this.canvas.width;
    }

    get h()
    {
        return this.canvas.height;
    }
}