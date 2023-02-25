import { c as create_ssr_component, v as validate_component, e as escape, d as add_attribute, f as compute_slots } from './index-d1808152.js';

const Setting = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"flex flex-row gap-4 items-center"}"><span class="${"text-sm italic"}">${slots.default ? slots.default({}) : ``}:
  </span>
  ${slots.input ? slots.input({}) : ``}</div>`;
});
const Primary = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { href = "" } = $$props;
  let { disabled = false } = $$props;
  let { selected = false } = $$props;
  let { form = void 0 } = $$props;
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.selected === void 0 && $$bindings.selected && selected !== void 0)
    $$bindings.selected(selected);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  return `<a class="${[
    "flex flex-1 items-center justify-center px-8 py-4 gap-2 bg-slate-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest ring-gray-300 transition ease-in-out duration-150 aria-disabled:cursor-not-allowed aria-disabled:opacity-25 hover:bg-slate-500 active:bg-slate-800 focus:outline-none focus:border-slate-900 focus:ring focus:ring-offset-2",
    (disabled ? "opacity-50" : "") + " " + (selected ? "ring" : "")
  ].join(" ").trim()}"${add_attribute("data-is-selected", selected, 0)}${add_attribute("data-target-form", form, 0)}${add_attribute("tabindex", !disabled ? 0 : -1, 0)}${add_attribute("href", !disabled ? href : "javascript:void(0);", 0)}>${slots.default ? slots.default({}) : ``}</a>`;
});
const Text = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { id = void 0 } = $$props;
  let { placeholder = void 0 } = $$props;
  let { value = "" } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { small = false } = $$props;
  let inputEl;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.small === void 0 && $$bindings.small && small !== void 0)
    $$bindings.small(small);
  return `<div class="${"flex flex-col gap-1"}">${$$slots.default ? `<label${add_attribute("for", id, 0)} class="${"text-sm font-bold text-gray-700"}"${add_attribute("this", inputEl, 0)}>${slots.default ? slots.default({}) : ``}</label>` : ``}

  <input${add_attribute("id", id, 0)} class="${"flex-1 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent " + escape(small ? "w-20" : "w-auto", true)}"${add_attribute("placeholder", placeholder, 0)} type="${"text"}" ${disabled ? "disabled" : ""} ${required ? "required" : ""}${add_attribute("value", value, 0)}></div>`;
});
const Range = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { id = void 0 } = $$props;
  let { placeholder = void 0 } = $$props;
  let { value } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { small = false } = $$props;
  let inputEl;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.small === void 0 && $$bindings.small && small !== void 0)
    $$bindings.small(small);
  return `<div class="${"flex flex-col gap-1"}">${$$slots.default ? `<label${add_attribute("for", id, 0)} class="${"text-sm font-bold text-gray-700"}"${add_attribute("this", inputEl, 0)}>${slots.default ? slots.default({}) : ``}</label>` : ``}

  <input${add_attribute("id", id, 0)} class="${"flex-1 px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent " + escape(small ? "w-20" : "w-auto", true)}"${add_attribute("placeholder", placeholder, 0)} type="${"range"}" ${disabled ? "disabled" : ""} ${required ? "required" : ""}${add_attribute("min", min, 0)}${add_attribute("max", max, 0)}${add_attribute("step", step, 0)}${add_attribute("value", value, 0)}></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let overlay = {
    heading: "Loading...",
    message: `Please wait while we load your video...`
  };
  let scaleSetting = 0.2;
  let width;
  let height;
  let framerate;
  let video;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `

<main class="${"flex flex-col gap-4"}"><div class="${"flex flex-col bg-slate-700 border-inside border-2 border-slate-600"}"><div class="${"flex flex-col gap-2 p-4 bg-slate-600 items-center"}">${validate_component(Setting, "Setting").$$render($$result, {}, {}, {
      input: () => {
        return `${validate_component(Text, "Text").$$render(
          $$result,
          {
            slot: "input",
            disabled: true,
            value: framerate?.toString()
          },
          {},
          {}
        )}`;
      },
      default: () => {
        return `Framerate
        `;
      }
    })}
      ${validate_component(Setting, "Setting").$$render($$result, {}, {}, {
      input: () => {
        return `<div slot="${"input"}" class="${"flex flex-row gap-2"}">${validate_component(Text, "Text").$$render(
          $$result,
          {
            small: true,
            disabled: true,
            value: width?.toString()
          },
          {},
          {}
        )}
          x
          ${validate_component(Text, "Text").$$render(
          $$result,
          {
            small: true,
            disabled: true,
            value: height?.toString()
          },
          {},
          {}
        )}</div>`;
      },
      default: () => {
        return `Resolution
        `;
      }
    })}
      ${validate_component(Setting, "Setting").$$render($$result, {}, {}, {
      input: () => {
        return `${validate_component(Range, "Range").$$render(
          $$result,
          {
            slot: "input",
            step: 0.1,
            min: 0.1,
            max: 1,
            value: scaleSetting
          },
          {
            value: ($$value) => {
              scaleSetting = $$value;
              $$settled = false;
            }
          },
          {}
        )}`;
      },
      default: () => {
        return `Scale
        `;
      }
    })}</div>
    <div class="${"overflow-hidden m-2"}" style="${"width: " + escape(width * scaleSetting, true) + "px; height: " + escape(height * scaleSetting, true) + "px;"}"><div class="${"relative overflow-hidden inline-block bg-white"}" style="${"width: " + escape(width, true) + "px; height: " + escape(height, true) + "px; transform: scale(" + escape(scaleSetting, true) + "); transform-origin: top left;"}"><iframe title="${"Video described by web-app"}" class="${"hidden"}" id="${"video"}"${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("this", video, 0)}></iframe></div></div></div>

  ${`${validate_component(Primary, "Primary").$$render($$result, {}, {}, {
      default: () => {
        return `Play`;
      }
    })}`}

  <div class="${"rounded bg-slate-700 p-4"}"><h2 class="${"text-xl"}">How to render</h2>
    <p>You can render this video by running this command in the root of your video project:</p>
    <pre>videobrew render</pre></div></main>

${overlay ? `<div class="${"fixed text-black bg-black bg-opacity-50 inset-0 z-50 flex flex-col items-center justify-center"}"><div class="${"flex flex-col gap-2 p-4 bg-white rounded-lg shadow w-64"}"><h1 class="${"text-2xl font-bold"}">${escape(overlay.heading)}</h1>
    <p class="${"text-gray-600"}"><!-- HTML_TAG_START -->${overlay.message}<!-- HTML_TAG_END --></p></div></div>` : ``}`;
  } while (!$$settled);
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-8ae49690.js.map
