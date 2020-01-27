let gl = null;

function color32hex(hex)
{
    let _r = (( hex >> 16 ) & 0xff),
        _g = (( hex >> 8 ) & 0xff),
        _b = (( hex ) & 0xff);

    return {
        r: _r / 255,
        g: _g / 255,
        b: _b / 255,
        a: 1.0
    }
}

function color32(r, g, b, a = 255)
{
   return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
        a: a / 255
    }
}

function buffers(vertex, index, color)
{
    return {
        vbo: vertex,
        ibo: index,
        color: color
    }
}

class achishaders
{
    constructor(vertex, fragment)
    {
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(vs));
        }

        let fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
        gl.compileShader(fs);
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(fs));
        }

        let prog = gl.createProgram();

        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);

        gl.linkProgram(prog);
        gl.validateProgram(prog);

        gl.detachShader(prog, vs);
        gl.detachShader(prog, fs);

        gl.deleteShader(vs);
        gl.deleteShader(fs);

        this.p = prog;
    }

    ortho(px)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.p, "orthographic"), false, px);
    }

    um4(name, val)
    {
        gl.uniformMatrix4fv(gl.getUniformLocation(this.p, name), false, val);
    }

    bind()
    {
        gl.useProgram(this.p);
    }

    unbind()
    {
        gl.useProgram(null);
    }
}

class achi
{
    constructor(canvasID)
    {
        this.canvas = document.querySelector(canvasID),
            gl = this.canvas.getContext("webgl2"),
            this.buffers = [];
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.resize();

        this.cl = color32(25, 25, 25, 255);
    }
    resize()
    {
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            console.log("Resized!");
        });
    }

    nf(f)
    {
        requestAnimationFrame(f);
    }

    unknown(amt = 0)
    {
        this.unk = new Float32Array( 12 * amt );
        for(var i = 0; i < amt; i++)
        {
            
        }
    }

    translateSize(x, y, w, h)
    {
        return [
            x, y, 0,
            x, y + h, 0,
            x + w, y, 0,
            x + w, y + h, 0
        ]
    }

    clear()
    {
        gl.clearColor(this.cl.r, this.cl.g, this.cl.b, this.cl.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    get w()
    {
        return this.canvas.width;
    }

    get h()
    {
        return this.canvas.height;
    }

    setup()
    {
        let sc = 250;
        let sc_c = sc / 2;
        this.s = this.translateSize(Math.floor(Math.random() * this.w), Math.floor(Math.random() * this.h), 100, 100);

        this.t = [
            0, 1, 2,
            3, 2, 1
        ];

        //let u = color32(132, 31, 35);
        let u = color32(Math.floor(Math.random() * 255 + 0), Math.floor(Math.random() * 255 + 0), Math.floor(Math.random() * 255 + 0))
        this.o = [
            u.r - 0.2, u.g - 0.2, u.b - 0.2, 1.0,
            u.r, u.g, u.b, 1.0,
            u.r - 0.2, u.g - 0.2, u.b - 0.2, 1.0,
            u.r, u.g, u.b, 1.0
        ];

        this.v = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.v);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.s), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.b);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.o), gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this.i = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.i);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.t), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    update(ang)
    {
        this.o[0] = ang;
        this.o[5] = ang;
        this.o[10] = ang;
    }

    render()
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.i);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.v);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.b);

        gl.enableVertexAttribArray(0);
        gl.enableVertexAttribArray(1);
       
        gl.drawElements(gl.TRIANGLES, this.t.length, gl.UNSIGNED_SHORT, 0);

        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}