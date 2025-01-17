// (C) 2024 GoodData Corporation

import React from "react";
import { FormattedMessage } from "react-intl";
import cx from "classnames";
import { isObjRef, isIdentifierRef } from "@gooddata/sdk-model";
import { Icon, IIconProps } from "@gooddata/sdk-ui-kit";

import { ValuesLimitingItem } from "../../../types.js";

interface ITitleWithIconProps {
    title: React.ReactNode;
    IconComponent?: React.FC<IIconProps>;
}

const ItemTitleWithIcon: React.FC<ITitleWithIconProps> = ({ title, IconComponent }) => {
    return (
        <span className="attribute-filter__limit__item__title">
            {IconComponent ? (
                <IconComponent className="attribute-filter__limit__item__icon" width={14} height={14} />
            ) : null}
            <span>{title}</span>
        </span>
    );
};

const AggregatedItemTitle: React.FC<{ titleNode: React.ReactNode }> = ({ titleNode }) => {
    return <span className="attribute-filter__limit__item__title--aggregated">{titleNode}</span>;
};

const isMetric = (item: ValuesLimitingItem) => isIdentifierRef(item) && item.type === "measure";
const isFact = (item: ValuesLimitingItem) => isIdentifierRef(item) && item.type === "fact";
const isAttribute = (item: ValuesLimitingItem) => isIdentifierRef(item) && item.type === "attribute";
const isParentFilter = (item: ValuesLimitingItem) => !isObjRef(item);

export interface ILimitingItemProps {
    title: string | React.ReactNode;
    item: ValuesLimitingItem;
    isDisabled?: boolean;
    onDelete: () => void;
}

const LimitingItemTitle: React.FC<ILimitingItemProps> = ({ item, title }) => {
    if (isParentFilter(item)) {
        return <ItemTitleWithIcon title={title} IconComponent={Icon.AttributeFilter} />;
    }
    if (isMetric(item)) {
        return <ItemTitleWithIcon title={title} IconComponent={Icon.Metric} />;
    }

    if (isFact(item)) {
        return (
            <AggregatedItemTitle
                titleNode={
                    <FormattedMessage
                        id="attributesDropdown.valuesLimiting.sumFact"
                        values={{ fact: <ItemTitleWithIcon title={title} IconComponent={Icon.Fact} /> }}
                    />
                }
            />
        );
    }
    if (isAttribute(item)) {
        return (
            <AggregatedItemTitle
                titleNode={
                    <FormattedMessage
                        id="attributesDropdown.valuesLimiting.countAttribute"
                        values={{
                            attribute: <ItemTitleWithIcon title={title} IconComponent={Icon.Attribute} />,
                        }}
                    />
                }
            />
        );
    }
    return <ItemTitleWithIcon title={title} />;
};

export const LimitingItem: React.FC<ILimitingItemProps> = (props) => {
    const { isDisabled, onDelete } = props;
    const classNames = cx("attribute-filter__limit__item", {
        "attribute-filter__limit__item--disabled": isDisabled,
    });
    return (
        <div className={classNames}>
            <LimitingItemTitle {...props} />
            <span
                className={cx(
                    "attribute-filter__limit__item__delete gd-icon-trash s-attribute-filter-limit-delete",
                    { "is-disabled": isDisabled },
                )}
                onClick={isDisabled ? undefined : onDelete}
                aria-label="Attribute filter limit delete"
            />
        </div>
    );
};
