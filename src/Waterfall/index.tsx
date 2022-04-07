/**
 * TypeScript
 * https://gist.github.com/Venryx/7cff24b17867da305fff12c6f8ef6f96
 *
 * - 1. 泛型的支持
 * - 2. `tsconfig.json` 支持 [参考 ReadME.md]
 */
import React, {
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactElement,
  RefAttributes,
  useEffect,
  useRef,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  VirtualizedList,
  RefreshControl,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import {CommonAnimationActions} from '../../types';

type ScrollToOffset = {
  y: number;
  animated?: boolean;
};

interface WaterfallProps<ItemT> {
  /**
   * FlastList 规范的 PropTypes，命名都一模一样，功能也一模一样。
   * 请参考: https://www.react-native.cn/docs/flatlist
   */
  data: ItemT[];
  /** 是都允许下拉刷新 */
  bounces?: boolean;
  numColumns?: number | undefined;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onEndReached?: (info: {distanceFromEnd: number}) => void;
  onEndReachedThreshold?: number | null | undefined;
  onRefresh?: () => void;
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;
  refreshing?: boolean | null | undefined;
  removeClippedSubviews?: boolean | undefined;
  scrollEventThrottle?: number | undefined;
  showsVerticalScrollIndicator?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
  ListEmptyComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  ListHeaderComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  ListFooterComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  renderItem: (
    item: ItemT,
    column: number,
    i: number,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  /** 动画相关 */
  animation?: CommonAnimationActions;
  /** 自定义属性 */
  pageSize?: number;
  /** 是否滚动到顶部 */
  isScroll2Top?: boolean;
}

interface WaterfallRefProps {
  /** 滚动到指定位置 */
  scrollToOffset: (params: ScrollToOffset) => void;
}

/**
 * 泛型的支持
 * 参考: https://stackoverflow.com/questions/59947787/generictype-in-react-fcpropst
 * @param props
 * @returns
 */

export const Waterfall = React.forwardRef(
  <T1 extends any>(
    props: WaterfallProps<T1>,
    ref: React.Ref<WaterfallRefProps>,
  ) => {
    let waterfall = useRef();
    const {
      bounces = true,
      numColumns = 2,
      showsVerticalScrollIndicator = false,
      removeClippedSubviews = true,
      onEndReachedThreshold = 0.2,
      scrollEventThrottle = 100,
      /** 自定义属性 */
      pageSize = 10,
      isScroll2Top = false,
      animation = {
        type: 'fadeInDown',
        duration: 1000,
        delay: 200,
      },
      refreshing = false,
      style,
      contentContainerStyle,
      onRefresh,
      onScroll,
    } = props;

    const defaultProps = {
      bounces,
      showsVerticalScrollIndicator,
      removeClippedSubviews,
      onEndReachedThreshold,
      scrollEventThrottle,
    };

    useEffect(() => {
      // @ts-ignore
      isScroll2Top && waterfall.current.scrollToOffset({animated: true, y: 0});
      return () => {};
    }, [isScroll2Top]);

    React.useImperativeHandle(ref, () => ({
      scrollToOffset: (params: ScrollToOffset) => {
        let {animated = false, y = 0} = params;
        // @ts-ignore
        waterfall.current.scrollToOffset({animated, y});
      },
    }));

    return (
      <VirtualizedList
        {...defaultProps}
        data={['']}
        // @ts-ignore
        ref={ref => (waterfall.current = ref)}
        getItemCount={data => 1}
        getItem={(data, index) => data[index]}
        style={[{flex: 1}, style]}
        onScroll={onScroll}
        keyExtractor={(item, index) => `react-native-miui`}
        ListHeaderComponent={props?.ListHeaderComponent ?? null}
        ListEmptyComponent={props?.ListEmptyComponent ?? null}
        ListFooterComponent={props?.ListFooterComponent ?? null}
        onEndReached={info => {
          /**
           * 🐞 有可能刚进来的时候，`props.data` 还没进来，但是他认为已经到达底部了。
           * console.log(`info.distanceFromEnd: ${info.distanceFromEnd}`);
           * info.distanceFromEnd > 16 && props?.onEndReached && props.onEndReached(info)
           */
          if (props.data.length > 0) {
            props?.onEndReached && props.onEndReached(info);
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={info => (
          <View style={[{flexDirection: 'row'}, contentContainerStyle]}>
            {Array.from({length: numColumns}, (_, i) => (
              <View key={`Column ${i + 1}`}>
                {props.data.map((__, _i) => {
                  if (_i % numColumns == i) {
                    return (
                      <Animatable.View
                        useNativeDriver={true}
                        delay={(_i % pageSize) * animation.delay}
                        animation={animation.type}
                        duration={animation.duration}
                        key={`Column ${i + 1} --> Datas[${_i}]`}>
                        {props.renderItem(__, i, _i)}
                      </Animatable.View>
                    );
                  } else {
                    return null;
                  }
                })}
              </View>
            ))}
          </View>
        )}
      />
    );
  },
);

const styles = StyleSheet.create({});

type Handle<T> = T extends ForwardRefExoticComponent<RefAttributes<infer T2>>
  ? T2
  : never;

export type Waterfall = Handle<typeof Waterfall>;