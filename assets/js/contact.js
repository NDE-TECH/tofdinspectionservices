/*
================================================================================
IAIS CONTACT FORM
This static GitHub Pages form does NOT need a backend.
It validates fields, then opens the visitor's email app with a prepared enquiry.

Future edit points:
- Change India/UAE destination email below.
- Add/remove fields by editing both contact.html and the `fields` array below.
================================================================================
*/

const form = document.querySelector('#proposal-form');
const statusMessage = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  // Stop here if browser validation finds a missing/invalid required field.
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const value = (name) => String(data.get(name) || '').trim();

  // ===== DESTINATION EMAILS: edit these if contact addresses change =====
  const destination = value('destination') === 'uae'
    ? 'i@iaisuae.com'
    : 'i@iaisindia.com';

  // ===== EMAIL BODY FIELDS =====
  const fields = [
    ['Name', 'name'],
    ['Company', 'company'],
    ['Email', 'email'],
    ['Phone / WhatsApp', 'phone'],
    ['Project location', 'location'],
    ['Target schedule', 'schedule'],
    ['Method requested', 'method'],
    ['Component / asset', 'component'],
    ['Material and thickness', 'material'],
    ['Code / specification', 'specification'],
    ['Inspection objective and scope', 'scope']
  ];

  const lines = fields.map(([label, key]) => {
    return `${label}: ${value(key) || 'Not supplied'}`;
  });

  const company = value('company') || 'Project';
  const subject = `Advanced ultrasonic inspection enquiry – ${company}`;
  const body = `${lines.join('\n\n')}\n\nPlease attach relevant drawings and specifications before sending.`;
  const mailtoLink = `mailto:${destination}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Provide a visible fallback in case the device does not open its email app.
  statusMessage.innerHTML = `Your email application should open with the enquiry. If it does not, <a href="${mailtoLink}">open the prepared email here</a>. Review and send the message from your email application.`;

  window.location.href = mailtoLink;
});
