class Tarea {
    constructor(id, nombre, completada = false) {
        this.id = id;
        this.nombre = nombre;
        this.completada = completada;
    }
    
    toggleEstado() {
        this.completada = !this.completada;
    }
    
    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }
}

class GestorDeTareas {
    constructor() {
        this.tareas = [];
        this.cargarTareas();
    }
    
    agregarTarea(nombre) {
        const id = Date.now();
        const tarea = new Tarea(id, nombre);
        this.tareas.push(tarea);
        this.guardarTareas();
        return tarea;
    }
    
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id);
        this.guardarTareas();
    }
    
    editarTarea(id, nuevoNombre) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.editar(nuevoNombre);
            this.guardarTareas();
        }
    }
    
    toggleCompletada(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.toggleEstado();
            this.guardarTareas();
        }
    }
    
    obtenerTareas() {
        return this.tareas;
    }
    
    guardarTareas() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }
    
    cargarTareas() {
        const tareasGuardadas = localStorage.getItem('tareas');
        if (tareasGuardadas) {
            const datos = JSON.parse(tareasGuardadas);
            this.tareas = datos.map(d => new Tarea(d.id, d.nombre, d.completada));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    const gestor = new GestorDeTareas();
    
    const agregarTarea = () => {
        const nombre = taskInput.value.trim();
        
        if (nombre === '') {
            alert('La tarea no puede estar vacía');
            return;
        }
        
        const tarea = gestor.agregarTarea(nombre);
        renderizarTareas();
        taskInput.value = '';
        taskInput.focus();
    };
    
    const renderizarTareas = () => {
        taskList.innerHTML = '';
        
        const tareas = gestor.obtenerTareas();
        
        tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = tarea.id;
            
            li.innerHTML = `
                <span class="task-text ${tarea.completada ? 'completed' : ''}">
                    ${tarea.nombre}
                </span>
                <div class="task-actions">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;
            
            const taskText = li.querySelector('.task-text');
            taskText.addEventListener('click', () => {
                gestor.toggleCompletada(tarea.id);
                renderizarTareas();
            });
            
            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                const nuevoNombre = prompt('Editar tarea:', tarea.nombre);
                if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
                    gestor.editarTarea(tarea.id, nuevoNombre.trim());
                    renderizarTareas();
                }
            });
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Eliminar esta tarea?')) {
                    gestor.eliminarTarea(tarea.id);
                    renderizarTareas();
                }
            });
            
            taskList.appendChild(li);
        });
    };
    
    addTaskBtn.addEventListener('click', agregarTarea);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarTarea();
        }
    });
    
    renderizarTareas();
});