await supa.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: true,
    emailRedirectTo: null,     // <-- no link required
    data: { flow: "code" }     // optional: flag for template
  }
});