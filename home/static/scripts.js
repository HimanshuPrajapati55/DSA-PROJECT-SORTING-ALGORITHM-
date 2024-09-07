// Sorting Visualizer Merge Sort function
const ANIMATION_SPEED_MS = 1;
const PRIMARY_COLOR = "#47474d";
const SECONDARY_COLOR = "yellow";

function merge_sort(event) {
    event.preventDefault(); // Prevent default anchor behavior

    fetch("mergesort/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"), // Ensure CSRF token is included
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            console.error(data.error);
            return;
        }
        const animations = data.animations;
        const arrayBars = document.getElementsByClassName("array-bars");

        animations.forEach((animation, index) => {
            // The animation array may contain [barOneIdx, barTwoIdx, newHeight]
            // For color changes, only barOneIdx and barTwoIdx are present
            const [barOneIdx, barTwoIdx, newHeight] = animation;

            if (newHeight !== undefined) {
                // Update the height of the bar
                setTimeout(() => {
                    arrayBars[barOneIdx].style.height = `${newHeight}px`;
                }, index * ANIMATION_SPEED_MS);
            } else {
                // Handle color changes
                setTimeout(() => {
                    arrayBars[barOneIdx].style.backgroundColor = SECONDARY_COLOR;
                    arrayBars[barTwoIdx].style.backgroundColor = SECONDARY_COLOR;
                }, index * ANIMATION_SPEED_MS);

                setTimeout(() => {
                    arrayBars[barOneIdx].style.backgroundColor = PRIMARY_COLOR;
                    arrayBars[barTwoIdx].style.backgroundColor = PRIMARY_COLOR;
                }, (index + 1) * ANIMATION_SPEED_MS);
            }
        });
        
        // Update the bars after sorting is complete
        setTimeout(() => {
            fetch("generate_random_data/")
            .then(response => response.json())
            .then(data => {
                const sortedArray = data.arr;
                const arrayBars = document.getElementsByClassName("array-bars");

                // Update array bars with sorted data
                sortedArray.forEach((value, idx) => {
                    arrayBars[idx].style.height = `${value}px`;
                });
            })
            .catch(error => console.error("Error:", error));
        }, animations.length * ANIMATION_SPEED_MS);
    })
    .catch((error) => console.error("Error:", error));
}


// Generate Random Data function
function generateRandomData(event) {
    event.preventDefault(); // Prevent default anchor behavior

    fetch("generate_random_data/")
    .then((response) => response.json())
    .then((data) => {
        const arrayBars = document.getElementsByClassName("array-bars");
        const newArray = data.arr;

        // Clear existing bars
        while (arrayBars[0]) {
            arrayBars[0].parentNode.removeChild(arrayBars[0]);
        }

        // Create new bars with updated data
        const container = document.querySelector(".array-container");
        newArray.forEach((value) => {
            const bar = document.createElement("div");
            bar.classList.add("array-bars");
            bar.style.height = `${value}px`;
            bar.style.backgroundColor = "#1778b0";
            container.appendChild(bar);
        });
    })
    .catch((error) => console.error("Error:", error));
}

// Helper function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
