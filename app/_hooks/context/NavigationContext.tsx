import { useRouter, type Href } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { BackHandler } from "react-native";

interface NavHistoryProps {
  history: string[];
  push: (path: string) => void;
  back: () => void;
}

const NavHistoryContext = createContext<NavHistoryProps>({
  history: [],
  push: () => {},
  back: () => {},
});

export const NavHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  // Inside HistoryProvider:
  useEffect(() => {
    const onBackPress = () => {
      if (history.length > 1) {
        back();
        return true; // prevent default behavior
      }
      return false; // allow default behavior (e.g., exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [history]);

  const push = (path: string) => {
    setHistory((prev) => [...prev, path]);
    router.push(path as Href);
  };

  // Argument of type 'string' is not assignable to parameter of type 'Href<string>'

  const back = () => {
    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();

      const previousPage = newHistory[newHistory.length - 1] || "/";
      router.replace(previousPage as Href);

      return newHistory;
    });
  };

  return (
    <NavHistoryContext.Provider value={{ history, push, back }}>
      {children}
    </NavHistoryContext.Provider>
  );
};

export const useNavHistory = () => useContext(NavHistoryContext);
