Accounts.onCreateUser(function(options, user) {
    user.username = user.username.toLowerCase();
    if (options.profile)
        user.profile = options.profile;
    return user;
});