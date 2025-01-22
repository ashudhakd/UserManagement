const apiUrl = "https://jsonplaceholder.typicode.com/users"; 

// Elements
const addUserBtn = document.getElementById("addUserBtn");
const userTable = document.getElementById("userTable").getElementsByTagName('tbody')[0];
const userModal = document.getElementById("userModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const userForm = document.getElementById("userForm");
const submitBtn = document.getElementById("submitBtn");
const modalTitle = document.getElementById("modalTitle");
const successPopup = document.getElementById("successPopup");

let currentUserId = null;

// Function to show success popup
function showSuccessPopup(message) {
    successPopup.textContent = message;
    successPopup.style.display = 'block';

    // Hide the popup after 3 seconds
    setTimeout(() => {
        successPopup.style.display = 'none';
    }, 3000);
}

// Fetch users from the API and populate the table
function fetchUsers() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            userTable.innerHTML = ''; // Clear the table before adding new rows
            data.forEach(user => {
                const row = userTable.insertRow();
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name.split(" ")[0]}</td>
                    <td>${user.name.split(" ")[1]}</td>
                    <td>${user.email}</td>
                    <td>Mock Dept</td>
                    <td>
                        <button class="editBtn" onclick="editUser(${user.id})">Edit</button>
                        <button class="deleteBtn" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
            });
        })
        .catch(err => console.error("Error fetching users:", err));
}

// Open the modal to add a new user
addUserBtn.addEventListener("click", () => {
    currentUserId = null;
    modalTitle.textContent = "Add User";
    userForm.reset();
    userModal.style.display = "flex";
});

// Close the modal
closeModalBtn.addEventListener("click", () => {
    userModal.style.display = "none";
});

// Add or Edit user on form submit
userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        department: document.getElementById("department").value,
    };

    if (currentUserId) {
        updateUser(currentUserId, formData);
    } else {
        addUser(formData);
    }
});

// Add user to the mock backend
function addUser(data) {
    fetch(apiUrl, {
        method: "POST",
        body: JSON.stringify({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            department: data.department
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(newUser => {
        // Simulate adding the user to the table
        const row = userTable.insertRow();
        row.innerHTML = `
            <td>${newUser.id}</td>
            <td>${newUser.name.split(" ")[0]}</td>
            <td>${newUser.name.split(" ")[1]}</td>
            <td>${newUser.email}</td>
            <td>Mock Dept</td>
            <td>
                <button class="editBtn" onclick="editUser(${newUser.id})">Edit</button>
                <button class="deleteBtn" onclick="deleteUser(${newUser.id})">Delete</button>
            </td>
        `;
        userModal.style.display = "none"; // Close the modal

        // Show success message
        showSuccessPopup('User added successfully!');
    })
    .catch(err => console.error("Error adding user:", err));
}

// Edit existing user
function editUser(userId) {
    fetch(`${apiUrl}/${userId}`)
        .then(response => response.json())
        .then(user => {
            currentUserId = userId;
            modalTitle.textContent = "Edit User";
            document.getElementById("firstName").value = user.name.split(" ")[0];
            document.getElementById("lastName").value = user.name.split(" ")[1];
            document.getElementById("email").value = user.email;
            document.getElementById("department").value = user.department;
            userModal.style.display = "flex";
        })
        .catch(err => console.error("Error fetching user:", err));
}

// Update user details (simulated in frontend)
function updateUser(userId, data) {
    // Simulate updating user in the API (mock)
    fetch(`${apiUrl}/${userId}`, {
        method: "PUT",
        body: JSON.stringify({
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            department: data.department,
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => response.json())
    .then(updatedUser => {
        // Find the row corresponding to the user and update it
        const rows = userTable.rows;
        for (let row of rows) {
            const cell = row.cells[0]; // The first cell has the user ID
            if (parseInt(cell.textContent) === userId) {
                row.cells[1].textContent = data.firstName;
                row.cells[2].textContent = data.lastName;
                row.cells[3].textContent = data.email;
                row.cells[4].textContent = data.department;
            }
        }
        userModal.style.display = "none"; // Close the modal

        // Show success message
        showSuccessPopup('User updated successfully!');
    })
    .catch(err => console.error("Error updating user:", err));
}

// Delete user (simulate in frontend)
function deleteUser(userId) {
    // Simulate deletion from the table
    fetch(`${apiUrl}/${userId}`, {
        method: "DELETE",
    })
    .then(() => {
        const rows = userTable.rows;
        for (let row of rows) {
            const cell = row.cells[0]; // The first cell has the user ID
            if (parseInt(cell.textContent) === userId) {
                row.remove(); // Remove the row
            }
        }
        // Show success message
        showSuccessPopup('User deleted successfully!');
    })
    .catch(err => console.error("Error deleting user:", err));
}

// Fetch initial user list on page load
fetchUsers();
