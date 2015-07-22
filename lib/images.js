Slingshot.fileRestrictions("avatarUploads", {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 1024 * 1024 // 1 Mb
});

Slingshot.fileRestrictions("blogUploads", {
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 2 * 1024 * 1024 // 2 Mb
});