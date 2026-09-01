import * as vm from 'vm';

/**
 * Runs `code` inside a throwaway V8 context created by Node's built-in `vm` module,
 * instead of eval()/new Function() which execute in this file's real global scope and
 * therefore have access to `process`, `require`, `module`, and every import/closure in
 * scope. `vm.createContext` gives the script its own global object, so flow-authored
 * "custom code" nodes can still run (they get JSON/Math/Date/etc. and whatever is
 * explicitly passed in `contextVars`), but they cannot reach the OS, filesystem, or
 * network through Node built-ins. `timeoutMs` stops synchronous infinite loops.
 *
 * This is a mitigation, not a hard security boundary against a determined attacker
 * with V8-internals knowledge — access to the "custom code"/"manualQry" fields that
 * feed this should still be restricted to trusted, authenticated builders.
 */
export function runInSandbox(code: string, contextVars: Record<string, any> = {}, timeoutMs = 2000): any {
  const sandbox: Record<string, any> = {
    ...contextVars,
    JSON, Math, Date, Array, Object, String, Number, Boolean, RegExp, Map, Set, Promise,
    console: { log() {}, warn() {}, error() {}, debug() {} },
  };
  const context = vm.createContext(sandbox);
  const script = new vm.Script(code, { filename: 'sandboxed-code.vm' });
  return script.runInContext(context, { timeout: timeoutMs });
}
