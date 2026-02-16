const fields = {
  fullName: document.getElementById('fullName'),
  designation: document.getElementById('designation'),
  artistWork: document.getElementById('artistWork'),
  mobile: document.getElementById('mobile'),
  address1: document.getElementById('address1'),
  address2: document.getElementById('address2')
};

const preview = document.getElementById('previewDetails');

function renderPreview() {
  preview.textContent = `ID NO: ______\nArtist Name: ${fields.fullName.value}\nDesignation: ${fields.designation.value}\nArtist Work: ${fields.artistWork.value}\nMobile No.: ${fields.mobile.value}\nAddress:\n${fields.address1.value}\n${fields.address2.value}`;
}

Object.values(fields).forEach((input) => input.addEventListener('input', renderPreview));
renderPreview();
