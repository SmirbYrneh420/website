// File structure of the Gallery.
const galleryStructure = [
    {
        name: "Paperization snippets",
        isFolder: true,
        image: "./Images/folder.png",
        contents: [
            {
                name: "test.txt",
                isFolder: false,
                image: "./Images/file.png",
                contents: "test"
            }
        ]
    },
    {
        name: "Something Style",
        isFolder: true,
        image: "./Images/folder.png",
        contents: [
            {
                name: "test.txt",
                isFolder: false,
                image: "./Images/file.png",
                contents: "test"
            }
        ]
    },
    {
        name: "Full-size works",
        isFolder: true,
        image: "./Images/folder.png",
        contents: [
            {
                name: "test.txt",
                isFolder: false,
                image: "./Images/file.png",
                contents: "test"
            }
        ]
    },
    {
        name: "Works in progress",
        isFolder: true,
        image: "./Images/folder.png",
        contents: [
            {
                name: "test.txt",
                isFolder: false,
                image: "./Images/file.png",
                contents: "test"
            }
        ]
    },
    {
        name: "README.txt",
        image: "./Images/textdoc.png",
        isFolder: false,
        contents: "galleryreadme"
    }
];

window.galleryStructure = galleryStructure;