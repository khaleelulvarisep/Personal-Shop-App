import { router } from "expo-router";
import { useMemo, useRef } from "react";
import { PanResponder } from "react-native";

type SwipeTargets = {
  left?: "/(tabs)/nearby-orders" | "/(tabs)/earnings";
  right?: "/(tabs)" | "/(tabs)/nearby-orders";
};

const SWIPE_DISTANCE = 70;
const SWIPE_MIN_DRIFT = 20;
const SWIPE_VELOCITY = 0.3;
const NAVIGATION_LOCK_MS = 220;

export function useTabSwipe({ left, right }: SwipeTargets) {
  const isNavigatingRef = useRef(false);

  return useMemo(
    () => {
      const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > SWIPE_MIN_DRIFT &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.25,
        onPanResponderRelease: (_, gestureState) => {
          if (isNavigatingRef.current) {
            return;
          }

          const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.25;
          if (!isHorizontal) {
            return;
          }

          const swipedLeft =
            gestureState.dx <= -SWIPE_DISTANCE || gestureState.vx <= -SWIPE_VELOCITY;
          const swipedRight =
            gestureState.dx >= SWIPE_DISTANCE || gestureState.vx >= SWIPE_VELOCITY;

          if (swipedLeft && left) {
            isNavigatingRef.current = true;
            router.navigate(left);
            setTimeout(() => {
              isNavigatingRef.current = false;
            }, NAVIGATION_LOCK_MS);
            return;
          }

          if (swipedRight && right) {
            isNavigatingRef.current = true;
            router.navigate(right);
            setTimeout(() => {
              isNavigatingRef.current = false;
            }, NAVIGATION_LOCK_MS);
          }
        },
      });

      return {
        panHandlers: panResponder.panHandlers,
        animatedStyle: undefined,
      };
    },
    [left, right]
  );
}
