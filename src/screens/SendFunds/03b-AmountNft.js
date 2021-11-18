// @flow
import React, { useCallback, useState } from "react";

import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { Trans, useTranslation } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";

import type { Transaction } from "@ledgerhq/live-common/lib/types";

import { accountScreenSelector } from "../../reducers/accounts";
import KeyboardView from "../../components/KeyboardView";
import Button from "../../components/Button";
import LText from "../../components/LText";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: {
    params: {
      accountId: string,
      transaction: Transaction,
    },
  },
};

export default function SendAmountCoin({ route }: Props) {
  // const navigation = useNavigation();
  const {
    params: { transaction },
  } = route;
  const { colors } = useTheme();
  const { account, parentAccount } = useSelector(accountScreenSelector(route));
  const [quantity, setQuantity] = useState(
    transaction.quantity?.toFixed() ?? 1,
  );

  const nft = account?.nfts?.find(
    nft =>
      nft.collection.contract === transaction?.collection &&
      nft.tokenId === transaction?.tokenIds[0],
  );

  const {
    // transaction,
    // setTransaction,
    status,
    bridgePending,
    // bridgeError,
  } = useBridgeTransaction(() => ({
    transaction: route.params.transaction,
    account,
    parentAccount,
  }));

  return (
    <>
      {/* <TrackScreen
        category="SendFunds"
        name="Amount"
        currencyName={currency.name}
      /> */}
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
        forceInset={forceInset}
      >
        <KeyboardView style={styles.container}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.amountWrapper}>
              <View style={styles.bottomWrapper}>
                <LText>{quantity}</LText>
                <View style={[styles.available]}>
                  <LText>Quantity available : {nft?.amount?.toFixed()}</LText>
                </View>
                <View style={styles.continueWrapper}>
                  <Button
                    event="SendAmountCoinContinue"
                    type="primary"
                    title={
                      <Trans
                        i18nKey={
                          !bridgePending
                            ? "common.continue"
                            : "send.amount.loadingNetwork"
                        }
                      />
                    }
                    onPress={() => {}}
                    disabled={!!status.errors.amount || bridgePending}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: "stretch",
  },
  available: {
    flexDirection: "row",
    display: "flex",
    flexGrow: 1,
    marginBottom: 16,
  },
  availableRight: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  availableLeft: {
    justifyContent: "center",
    flexGrow: 1,
  },
  maxLabel: {
    marginRight: 4,
  },
  bottomWrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  amountWrapper: {
    flex: 1,
  },
  switch: {
    opacity: 0.99,
  },
  infoDescriptionWrapper: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "red",
    width: 100,
  },
  infoDescription: {
    flexShrink: 1,
    marginBottom: 14,
  },
  learnMore: {
    marginRight: 4,
    alignSelf: "flex-end",
  },
});
