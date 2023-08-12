import * as React from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
export function useBlocker(blocker, when = true) {
  const { navigator } = React.useContext(NavigationContext);
  React.useEffect(() => {
    if (!when) return;
    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      };
      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
}
export default function useNavigationBlocker(message, when = true) {
  console.log(message);
  const blocker = React.useCallback(
    (tx) => {
      if (window.confirm(message)) tx.retry();
    },
    [message]
  );
  useBlocker(blocker, when);
}
