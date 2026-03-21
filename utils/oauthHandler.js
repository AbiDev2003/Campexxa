const User = require("../models/user");
async function handleOauthUser(profile, provider) {
  const email = profile.emails?.[0]?.value?.toLowerCase();

  const providerIdField = `${provider}Id`;

  // check if provider user account exists
  let user = await User.findOne({ [providerIdField]: profile.id });
  if (user) return user;

  // check email conflict
  user = await User.findOne({ email });

  if (user) {
    if (!user[providerIdField]) {
      user[providerIdField] = profile.id;
    }

    if (!user.authProviders) {
      user.authProviders = [];
    }

    if (!user.authProviders.includes(provider)) {
      user.authProviders.push(provider);
    }

    await user.save();
    return user;
  }

  // create username from email
  let username = email.split("@")[0].replace(/\./g, "_");

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    username = `${username}_${profile.id.slice(0, 5)}`;
  }

  user = new User({
    username,
    email,
    fullName: profile.displayName || username,
    [providerIdField]: profile.id,
    authProviders: [provider],
  });

  await user.save();

  return user;
}

module.exports = handleOauthUser;
