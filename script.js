document.addEventListener('DOMContentLoaded', () => {

    const navgBarToggle = document.querySelector('.navgBar-toggle');
    const navgBarContainer = document.querySelector('.navgBar-links-container');
    const navgBarLinks = document.querySelectorAll('.navgBar-link');
    const header = document.getElementById('navigationBar');

    if (navgBarToggle && navgBarContainer) {
        navgBarToggle.addEventListener('click', () => {
            document.body.classList.toggle('navgBar-open');
        });

        navgBarLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('navgBar-open');
            });
        });
    }

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillProgressBars.forEach(bar => {
                        bar.style.width = bar.dataset.progress + '%';
                    });
                    observer.unobserve(skillsSection);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(skillsSection);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:myaseenmc@duck.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            window.open(mailtoLink, '_blank');
            contactForm.reset();
        });
    }

    const calculator = document.getElementById('calculator');
    const display = document.getElementById('calc-display');
    if (calculator && display) {
        let currentValue = '0';
        let previousValue = '';
        let operator = null;
        let waitingForSecondOperand = false;

        calculator.addEventListener('click', (e) => {
            const key = e.target.closest('button');
            if (!key) return;

            const { key: keyValue, operator: operatorValue } = key.dataset;

            if (key.classList.contains('calcuNumber')) inputDigit(keyValue);
            else if (key.classList.contains('calcuOperator')) handleOperator(operatorValue);
            else if (keyValue === '.') inputDecimal();
            else if (keyValue === 'clear') resetCalculator();
            else if (keyValue === 'backspace') backspace();
            else if (keyValue === '=') handleOperator('=');

            updateDisplay();
        });

        const updateDisplay = () => {
            display.textContent = currentValue.length > 12 ? parseFloat(currentValue).toExponential(5) : currentValue;
        };
        const inputDigit = (digit) => {
            if (waitingForSecondOperand) {
                currentValue = digit;
                waitingForSecondOperand = false;
            } else {
                currentValue = currentValue === '0' ? digit : currentValue + digit;
            }
        };
        const inputDecimal = () => {
            if (waitingForSecondOperand) {
                currentValue = '0.';
                waitingForSecondOperand = false;
                return;
            }
            if (!currentValue.includes('.')) currentValue += '.';
        };
        const handleOperator = (nextOperator) => {
            const inputValue = parseFloat(currentValue);
            if (operator && waitingForSecondOperand) {
                operator = nextOperator;
                return;
            }
            if (previousValue === '') {
                previousValue = inputValue;
            } else if (operator) {
                const result = calculate(previousValue, inputValue, operator);
                currentValue = `${parseFloat(result.toFixed(7))}`;
                previousValue = result;
            }
            waitingForSecondOperand = true;
            operator = nextOperator;
        };
        const calculate = (first, second, op) => {
            if (op === '+') return first + second;
            if (op === '-') return first - second;
            if (op === '*') return first * second;
            if (op === '/') return second === 0 ? 'Error' : first / second;
            if (op === '%') return first % second;
            return second;
        };
        const resetCalculator = () => {
            currentValue = '0';
            previousValue = '';
            operator = null;
            waitingForSecondOperand = false;
        };
        const backspace = () => {
            currentValue = currentValue.slice(0, -1) || '0';
        };
    }

    const taskManager = document.getElementById('task-manager');
    if (taskManager) {
        const newTaskInput = document.getElementById('new-task-input');
        const addTaskbutton = document.getElementById('add-task-button');
        const lists = {
            todo: document.getElementById('todo-list'),
            progress: document.getElementById('progress-list'),
            done: document.getElementById('done-list')
        };
        const columnMap = ['todo', 'progress', 'done'];
        let taskIdCounter = 0;

        const createTaskElement = (text, id, status) => {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card task-card-${status}`;
            taskCard.dataset.id = id;
            taskCard.dataset.status = status;

            const currentIndex = columnMap.indexOf(status);

            taskCard.innerHTML = `
                <div class="content">
                    <span></span>
                    <div class="task-card-controls">
                        <button class="move-left" style="display: ${currentIndex > 0 ? 'inline-block' : 'none'};">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <button class="move-right" style="display: ${currentIndex < 2 ? 'inline-block' : 'none'};">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                        <button class="delete-button">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>`;

            taskCard.querySelector('.content span').textContent = text;

            taskCard.querySelector('.delete-button').addEventListener('click', () => taskCard.remove());
            taskCard.querySelector('.move-left').addEventListener('click', () => moveTask(taskCard, -1));
            taskCard.querySelector('.move-right').addEventListener('click', () => moveTask(taskCard, 1));

            return taskCard;
        };

        const addTask = () => {
            const taskText = newTaskInput.value.trim();
            if (taskText) {
                const taskId = taskIdCounter++;
                const taskElement = createTaskElement(taskText, taskId, 'todo');
                lists.todo.appendChild(taskElement);
                newTaskInput.value = '';
                newTaskInput.focus();
            }
        };

        const moveTask = (taskElement, direction) => {
            const currentStatus = taskElement.dataset.status;
            const currentIndex = columnMap.indexOf(currentStatus);
            const newIndex = currentIndex + direction;

            if (newIndex >= 0 && newIndex < columnMap.length) {
                const newStatus = columnMap[newIndex];
                const text = taskElement.querySelector('.content span').textContent;
                const id = taskElement.dataset.id;

                const newCard = createTaskElement(text, id, newStatus);
                lists[newStatus].appendChild(newCard);
                taskElement.remove();
            }
        };

        addTaskbutton.addEventListener('click', addTask);
        newTaskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
    }

});
