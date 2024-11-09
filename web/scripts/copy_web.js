const fs = require("fs-extra");

// Source and destination paths
const sourcePath = "./web/out";
const destinationPath = "./api/public";

// Function to copy folder
async function copyFolder() {
	try {
		// Copy the folder
		await fs.copy(sourcePath, destinationPath, { overwrite: true });

		console.log("Folder copied successfully.");
	} catch (err) {
		console.error("Error copying folder:", err);
	}
}

// Call the function
copyFolder();
