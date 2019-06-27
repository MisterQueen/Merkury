import '../scss/main.scss';


$(document).ready(function(){
    $(function () {
        $('.toggle').on('click', function () {
                document.getElementsByTagName("span")[0].setAttribute('class', 'open');
                document.getElementsByTagName("span")[1].setAttribute('class', 'open');
                document.getElementsByTagName("span")[2].setAttribute('class', 'open');
                document.getElementsByTagName("span")[3].setAttribute('class', 'open');
            $('.menu').slideToggle(250, function() {
                if($(this).css('display') === 'none') {
                    $(this).removeAttr('style')
                    document.getElementsByClassName("open")[0].removeAttribute('class');
                    document.getElementsByClassName("open")[0].removeAttribute('class');
                    document.getElementsByClassName("open")[0].removeAttribute('class');
                    document.getElementsByClassName("open")[0].removeAttribute('class');
                }
            })
        })
    });


    $("#menu").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
    $("#menu2").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });


    const time = setTimeout(() => {
        const point = document.getElementsByClassName('point');

        for (let i = 0; i < point.length; i++) {
            document.getElementsByClassName('First')[i].innerText = point[i].textContent.charAt(0);
        }

        clearTimeout(time);
    }, 1);


    function getCount(parent, getChildrensChildren) {
        var relevantChildren = 0;
        var children = parent.childNodes.length;
        for (var i = 0; i < children; i++) {
            if (parent.childNodes[i].nodeType != 3) {
                if (getChildrensChildren)
                    relevantChildren += getCount(parent.childNodes[i], true);
                relevantChildren++;
            };
        };
        return relevantChildren;
    };


    $('.del_btn').click(function(e) {
        e.preventDefault();
        $(this).closest('.draggable1').remove();

        var gCP = getCount(document.getElementById('draggableContainer'), false);
        var gCC = getCount(document.getElementById('droppable'), false);
        document.getElementById('progresNumb').innerText = gCP;
        document.getElementById('CompletedNumb').innerText = gCC;
      });


    // создание Drag'n Drop
var DragManager = new function () {
    /**
     * составной объект для хранения информации о переносе:
     * {
     *   elem - элемент, на котором была зажата мышь
     *   avatar - аватар
     *   downX/downY - координаты, на которых был mousedown
     *   shiftX/shiftY - относительный сдвиг курсора от угла элемента
     * }
     */
    var dragObject = {};
    var self = this;

    function onMouseDown(e) {

        if (e.which != 1) return;

        var elem = e.target.closest('.draggable');
        if (!elem) return;

        dragObject.elem = elem;

        // запомним, что элемент нажат на текущих координатах pageX/pageY
        dragObject.downX = e.pageX;
        dragObject.downY = e.pageY;

        return false;
    }

    function onMouseMove(e) {
        if (!dragObject.elem) return; // элемент не зажат

        if (!dragObject.avatar) { // если перенос не начат...
            var moveX = e.pageX - dragObject.downX;
            var moveY = e.pageY - dragObject.downY;

            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(moveX) < 10 && Math.abs(moveY) < 10) {

                dragObject.elem.setAttribute("id", "draggable");
                dragObject.elem.getElementsByClassName("draggableDiv")[0].setAttribute("id", "draggableChange");
                return;
            }

            // начинаем перенос
            dragObject.avatar = createAvatar(e); // создать аватар
            if (!dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                dragObject = {};
                return;
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            var coords = getCoords(dragObject.avatar);
            dragObject.shiftX = dragObject.downX - coords.left;
            dragObject.shiftY = dragObject.downY - coords.top;

            startDrag(e); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
        dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

        return false;
    }

    function onMouseUp(e) {
        if (dragObject.avatar) { // если перенос идет
            finishDrag(e);
        }

        // перенос либо не начинался, либо завершился
        // в любом случае очистим "состояние переноса" dragObject
        dragObject = {};
    }

    function finishDrag(e) {
        var dropElem = findDroppable(e);

        if (!dropElem) {
            self.onDragCancel(dragObject);
        } else {
            self.onDragEnd(dragObject, dropElem);
        }
    }

    function createAvatar(e) {

        // запомнить старые свойства, чтобы вернуться к ним при отмене переноса
        var avatar = dragObject.elem;
        var old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        // функция для отмены переноса
        avatar.rollback = function () {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex;
            document.getElementById("draggable").setAttribute("id", "EPICK_FAIL");
            document.getElementById("draggableChange").setAttribute("id", "EPICK_FAIL_LAL");
        };

        return avatar;
    }

    function startDrag(e) {
        var avatar = dragObject.avatar;

        // инициировать начало переноса
        document.body.appendChild(avatar);
        avatar.style.zIndex = 9999;
        avatar.style.position = 'absolute';
    }

    function findDroppable(event) {
        // спрячем переносимый элемент
        dragObject.avatar.hidden = true;

        // получить самый вложенный элемент под курсором мыши
        var elem = document.elementFromPoint(event.clientX, event.clientY);

        // показать переносимый элемент обратно
        dragObject.avatar.hidden = false;

        if (elem == null) {
            // такое возможно, если курсор мыши "вылетел" за границу окна
            return null;
        }

        return elem.closest('.droppable');
    }

    document.onmousemove = onMouseMove;
    document.onmouseup = onMouseUp;
    document.onmousedown = onMouseDown;

    this.onDragEnd = function (dragObject, dropElem) { };
    this.onDragCancel = function (dragObject) { };

};


function getCoords(elem) { // кроме IE8-
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

};


DragManager.onDragCancel = function (dragObject) {
    dragObject.avatar.rollback();
};


function appendIt() {
    var sheet = document.getElementById("draggable");
    document.getElementById("droppable").appendChild(sheet);
};


DragManager.onDragEnd = function (dragObject, dropElem) {
    dragObject.elem.style.display = 'block';
    dragObject.elem.style.position = '';
    appendIt();
    document.getElementById("draggable").setAttribute("class", "draggable1");
    document.getElementById("draggable").removeAttribute("id");
    document.getElementById("draggableChange").setAttribute("class", "draggableChanged");
    document.getElementById("draggableChange").getElementsByTagName("p")[0].innerText = 'Completed!';
    document.getElementById("draggableChange").removeAttribute("id");
    //Count quantity of objects
    var gCP = getCount(document.getElementById('draggableContainer'), false);
    var gCC = getCount(document.getElementById('droppable'), false);
    document.getElementById('progresNumb').innerText = gCP;
    document.getElementById('CompletedNumb').innerText = gCC;
};



//Create a slider in drop div
var next = document.getElementById('next');
var prew = document.getElementById('prew');
var slides = document.getElementsByClassName('slide');


next.onclick = function () {
    var activeEl = document.querySelector('.active');
    if (activeEl.nextElementSibling) {
        activeEl.style.left = "-100%";
        activeEl.classList.remove('active');
        activeEl.nextElementSibling.classList.add('active');
    };
};


prew.onclick = function () {
    var activeEl = document.querySelector('.active');
    if (activeEl.previousElementSibling) {
        activeEl.previousElementSibling.setAttribute('style', 'left: 100%');
        activeEl.classList.remove('active');
        activeEl.previousElementSibling.classList.add('active');
    };
};
});




















