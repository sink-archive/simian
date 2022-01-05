import Patcher from "./patcher";
export default Patcher;

// @ts-ignore
// to help with testing the patcher easily from pasting the bundle into devtools
window.patcher = new Patcher("simian test patcher");