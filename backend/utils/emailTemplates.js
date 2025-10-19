function employeeWelcome({ role, name, id, user_name, password }) {
  const title = role === 'assistant' ? 'Welcome to KandyPack - Assistant' : 'Welcome to KandyPack - Driver';
  const idLabel = role === 'assistant' ? 'Assistant ID' : 'Driver ID';
  const safeName = name || 'Team Member';
  const safeId = id || '(assigned)';
  const safeUsername = user_name || '(see admin)';
  const safePassword = password || '(see admin)';
  
  const text = `${title}\n\nHi ${safeName},\n\nYour account has been created successfully.\n\n${idLabel}: ${safeId}\nUsername: ${safeUsername}\nPassword: ${safePassword}\n\nIMPORTANT: Please log in and change your password immediately for security.\n\nYou can log in at: [Your Login URL]\n\nIf you have any questions, reply to this email.\n\n— KandyPack Team`;
  
  const html = `
  <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#222;max-width:600px;margin:0 auto;padding:20px;border:1px solid #ddd;border-radius:8px">
    <h2 style="color:#2c3e50;margin-bottom:20px">${title}</h2>
    <p>Hi <strong>${safeName}</strong>,</p>
    <p>Your account has been created successfully.</p>
    
    <div style="background:#f8f9fa;padding:15px;border-radius:6px;margin:20px 0">
      <p style="margin:5px 0"><strong>${idLabel}:</strong> ${safeId}</p>
      <p style="margin:5px 0"><strong>Username:</strong> ${safeUsername}</p>
      <p style="margin:5px 0"><strong>Password:</strong> <code style="background:#fff;padding:4px 8px;border-radius:4px;font-family:monospace">${safePassword}</code></p>
    </div>
    
    <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px;margin:20px 0">
      <p style="margin:0;color:#856404"><strong>⚠️ IMPORTANT:</strong> Please log in and change your password immediately for security.</p>
    </div>
    
    <p>You can log in at: <a href="#">[Your Login URL]</a></p>
    <p>If you have any questions, reply to this email.</p>
    <p style="margin-top:30px;color:#666">— KandyPack Team</p>
  </div>`;
  
  return { subject: title, text, html };
}

module.exports = { employeeWelcome };
