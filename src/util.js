export async function copyValue(event, value) {
  event.preventDefault();

  const el = document.createElement("textarea");
  document.body.appendChild(el);
  el.value = value;
  el.select();
  document.execCommand("copy");
  el.remove();
}
