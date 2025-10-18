let registeredStudents = [];
const MIN_PASSWORD_LENGTH = 6;


const form = document.getElementById('registration-form');
const submitButton = document.getElementById('submit-btn');
const studentListBody = document.getElementById('student-list-body');


const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const genderInput = document.getElementsByName('gender');
const courseInput = document.getElementById('course');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

const validationState = {
    name: false,
    age: false,
    gender: false,
    course: false,
    email: false,
    password: false
};


function setValidationState(field, isValid) {
    validationState[field] = isValid;
    const inputElement = document.getElementById(field) || document.getElementById(`${field}-input`);
    if (inputElement) {
        inputElement.classList.toggle('invalid', !isValid);
    }
    updateSubmitButtonState();
}

function validateName() {
    const name = nameInput.value.trim();
    const isValid = name !== "";
    document.getElementById('name-error').textContent = isValid ? "" : "Name is required.";
    setValidationState('name', isValid);
    return isValid;
}

function validateAge() {
    const age = parseInt(ageInput.value);
    const errorElement = document.getElementById('age-error');
    let isValid = false;

    if (isNaN(age) || ageInput.value.trim() === "") {
        errorElement.textContent = "Age is required.";
    } else if (age < 16 || age > 100) {
        errorElement.textContent = "Age must be between 16 and 100.";
    } else {
        errorElement.textContent = "";
        isValid = true;
    }
    setValidationState('age', isValid);
    return isValid;
}

function validateGender() {
    const errorElement = document.getElementById('gender-error');
    const selected = Array.from(genderInput).some(radio => radio.checked);

    errorElement.textContent = selected ? "" : "Gender selection is required.";
    setValidationState('gender', selected);
    return selected;
}

function validateCourse() {
    const course = courseInput.value;
    const isValid = course !== "";
    document.getElementById('course-error').textContent = isValid ? "" : "Please select a course.";
    setValidationState('course', isValid);
    return isValid;
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = emailRegex.test(email);

    let errorMessage = "";
    if (email === "") {
        errorMessage = "Email is required.";
        isValid = false;
    } else if (!isValid) {
        errorMessage = "Please enter a valid email address.";
    }

    document.getElementById('email-error').textContent = errorMessage;
    setValidationState('email', isValid);
    return isValid;
}

function validatePassword() {
    const password = passwordInput.value;
    const isValid = password.length >= MIN_PASSWORD_LENGTH;

    document.getElementById('password-error').textContent = isValid ? "" : `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    setValidationState('password', isValid);
    return isValid;
}


function updateSubmitButtonState() {
    const isFormValid = Object.values(validationState).every(val => val === true);
    submitButton.disabled = !isFormValid;
}


function renderStudentList() {
    studentListBody.innerHTML = '';

    if (registeredStudents.length === 0) {
        const emptyRow = `<tr><td colspan="6" style="text-align: center;">No students registered yet.</td></tr>`;
        studentListBody.innerHTML = emptyRow;
        return;
    }

    registeredStudents.forEach((student, index) => {
        const row = studentListBody.insertRow();

        row.insertCell().textContent = student.name;
        row.insertCell().textContent = student.age;
        row.insertCell().textContent = student.gender;
        row.insertCell().textContent = student.course;
        row.insertCell().textContent = student.email;


        let cellAction = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.index = index;
        deleteButton.addEventListener('click', handleDelete);

        cellAction.appendChild(deleteButton);
    });
}

function handleDelete(event) {
    const indexToDelete = parseInt(event.target.dataset.index);
    registeredStudents.splice(indexToDelete, 1);
    renderStudentList();
}


nameInput.addEventListener('input', validateName);
ageInput.addEventListener('input', validateAge);
courseInput.addEventListener('change', validateCourse);
emailInput.addEventListener('input', validateEmail);
passwordInput.addEventListener('input', validatePassword);

nameInput.addEventListener('blur', validateName);
ageInput.addEventListener('blur', validateAge);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

Array.from(genderInput).forEach(radio => {
    radio.addEventListener('change', validateGender);
});

form.addEventListener('submit', function (event) {
    event.preventDefault();
    const allValid = validateName() && validateAge() && validateGender() && validateCourse() && validateEmail() && validatePassword();

    if (!allValid) {
        alert("Please correct the errors before submitting.");
        return;
    }


    const selectedGender = Array.from(genderInput).find(radio => radio.checked).value;
    const newStudent = {
        name: nameInput.value.trim(),
        age: ageInput.value.trim(),
        gender: selectedGender,
        course: courseInput.value,
        email: emailInput.value.trim(),
        password: passwordInput.value
    };
    registeredStudents.push(newStudent);
    renderStudentList();
    form.reset();
    Object.keys(validationState).forEach(key => {
        validationState[key] = false;
        const inputElement = document.getElementById(key) || document.getElementById(`${key}-input`);
        if (inputElement && inputElement.classList) {
            inputElement.classList.remove('invalid');
        }
    });
    updateSubmitButtonState();
});
renderStudentList();