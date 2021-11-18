// @flow
import React, { useCallback } from "react";

import { useNavigation, useTheme } from "@react-navigation/native";
import { useNftMetadata } from "@ledgerhq/live-common/lib/nft";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";

import type { Account } from "@ledgerhq/live-common/lib/types";
import type { CollectionWithNFT } from "@ledgerhq/live-common/lib/nft";

import NftImage from "../../components/Nft/NftImage";
import Skeleton from "../../components/Skeleton";
import ChevronIcon from "../../icons/Chevron";
import LText from "../../components/LText";
import { ScreenName } from "../../const";

const CollectionRow = ({
  account,
  collection,
}: {
  account: Account,
  collection: CollectionWithNFT,
}) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { status, metadata } = useNftMetadata(
    collection?.contract,
    collection?.nfts?.[0]?.tokenId,
  );

  const goToNftSelection = () => {
    navigation.push(ScreenName.SendNft, {
      account,
      collection,
    });
  };

  return (
    <TouchableOpacity style={styles.collectionRow} onPress={goToNftSelection}>
      <View style={styles.nftImageContainer}>
        <NftImage
          style={styles.nftImage}
          src={metadata?.media}
          status={status}
        />
      </View>
      <View style={styles.tokenNameContainer}>
        <Skeleton
          style={[styles.tokenNameSkeleton, styles.tokenName]}
          loading={status === "loading"}
        >
          <LText>{metadata?.tokenName || collection.contract}</LText>
        </Skeleton>
      </View>
      <View style={styles.chevronContainer}>
        <ChevronIcon size={11} color={colors.grey} />
      </View>
    </TouchableOpacity>
  );
};

const keyExtractor = (collection: CollectionWithNFT) => collection?.contract;

type Props = {
  route: {
    params: {
      account: Account,
      collections: CollectionWithNFT[],
    },
  },
};

const SendFundsSelectCollection = ({ route }: Props) => {
  const { params } = route;
  const { account, collections } = params;
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: CollectionWithNFT }) => (
      <CollectionRow account={account} collection={item} />
    ),
    [account],
  );

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={{ bottom: "always" }}
    >
      <FlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  collectionRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  nftImageContainer: {
    flexGrow: 0,
    width: 48,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
          height: 2,
        },
      },
    }),
  },
  nftImage: {
    height: 48,
    width: 48,
    borderRadius: 4,
    overflow: "hidden",
  },
  tokenNameContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  tokenNameSkeleton: {
    height: 12,
    borderRadius: 4,
  },
  tokenName: {},
  chevronContainer: {
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    transform: [
      {
        rotate: "-90deg",
      },
    ],
  },
});

export default SendFundsSelectCollection;
