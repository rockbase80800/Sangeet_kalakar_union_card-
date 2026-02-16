const fields = {
  fullName: document.getElementById('fullName'),
  designation: document.getElementById('designation'),
  artistWork: document.getElementById('artistWork'),
  mobile: document.getElementById('mobile'),
  address1: document.getElementById('address1'),
  address2: document.getElementById('address2')
};

const preview = document.getElementById('previewDetails');

const fill = (value, fallback = '________________') => {
  const v = (value || '').trim();
  return v.length ? v : fallback;
};

function renderPreview() {
  preview.textContent = `ID NO: ______\nArtist Name: ${fill(fields.fullName.value)}\nDesignation: ${fill(fields.designation.value)}\nArtist Work: ${fill(fields.artistWork.value)}\nMobile No.: ${fill(fields.mobile.value)}\nAddress:\n${fill(fields.address1.value)}\n${fill(fields.address2.value)}`;
}

Object.values(fields).forEach((input) => input.addEventListener('input', renderPreview));
renderPreview();
