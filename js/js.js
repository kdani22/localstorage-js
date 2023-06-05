window.onload = () => {
    let $listaTareas = document.querySelector(".contenedor .contenedor-registros #lista-tareas");

    const getAllTareas = () => {
        let tareas = localStorage.getItem("tareas");
        return tareas;
    }

    const validacionItemLocalStorage = (tareas) => {
        // Evitar generar error si el usuario elimina la memoria e intenta utilizar la funcionalidad de guardar
        if (!tareas) {
            localStorage.setItem("tareas", "[]");
            tareas = [];
        }

        return tareas;
    }

    const deleteTarea = (id = null) => {
        if (!id) {
            return "error";
        }
        let tareas = JSON.parse(getAllTareas());

        tareas.forEach((tarea, index) => {
            if (tarea.id == id) {
                tareas.splice(index, 1);
            }
        });

        localStorage.setItem("tareas", JSON.stringify(tareas));

        listarTareas();
    }

    const listarTareas = () => {
        let tareas = JSON.parse(getAllTareas());
        let templateTareas = "";

        tareas.forEach(tarea => {
            templateTareas += `
            <li data-id="${tarea.id}">
                <div>
                    <span>${tarea.tarea}</span> 
                    <button class="btn btn-outline-danger boton-eliminar-tarea"><i class="bi bi-trash3"></i></button>
                </div>
            </li>
            `;
        });

        if (tareas.length !== 0) {
            $listaTareas.innerHTML = templateTareas;
        } else {
            $listaTareas.innerHTML = "<h4>No tienes tareas</h4>";
        }

        let $tareas = $listaTareas.querySelectorAll("li");

        $tareas.forEach(tarea => {
            tarea.querySelector("button").addEventListener("click", () => deleteTarea(tarea.dataset.id));
        });
    }

    const addTarea = (tarea = null) => {
        if (!tarea) {
            return "Falló";
        }

        let tareas = JSON.parse(getAllTareas());
        tareas = validacionItemLocalStorage(tareas);

        // Devuelve id segun las tareas creadas
        const creaId = () => {
            if (tareas.length === 0) {
                return 1;
            } else {
                return tareas[tareas.length - 1].id + 1;
            }
        }

        let nuevaTarea = {
            id: creaId(),
            tarea: tarea,
        };

        tareas.push(nuevaTarea);
        localStorage.setItem("tareas", JSON.stringify(tareas));
        listarTareas();

        $listaTareas.lastElementChild.classList.add("agregada");
      
        return nuevaTarea;
    }

    const funcionalidadesBase = () => {
        let $inputTarea = document.querySelector(".contenedor .contenedor-tarjeta-formulario #input-tarea"),
        $botonAgregarTarea = document.querySelector(".contenedor .contenedor-tarjeta-formulario #boton-tarea"),
        $textErrorInputTarea = document.querySelector(".contenedor .contenedor-tarjeta-formulario .error-input-tarea");

        const validacionInput = () => {
            $inputTarea.classList.remove("error");

            if(/^(?! )[\p{L}\s]+(?! )$/u.test($inputTarea.value)) {
                console.log("Guardado exitoso");
                addTarea($inputTarea.value);
                $inputTarea.value = "";
                $textErrorInputTarea.textContent = "";
            } else {
                $textErrorInputTarea.textContent = "La tarea no puede contener numeros, caractéres especiales ni espacios en blanco al principio de la tarea.";
                $inputTarea.classList.add("error");
            }
        }

        // Evento Botón Guardar
        $botonAgregarTarea.addEventListener("click", () => validacionInput());
    }

    const init = () => {
        let tareas = JSON.parse(getAllTareas());
        tareas = validacionItemLocalStorage(tareas);

        listarTareas();
        funcionalidadesBase();
    }

    init();
};

