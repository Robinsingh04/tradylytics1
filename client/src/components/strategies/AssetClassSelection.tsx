import React from 'react';
import { 
  Typography, 
  Box, 
  Tooltip
} from '@mui/material';
import { 
  AttachMoney, 
  AccountBalance, 
  CurrencyBitcoin, 
  Timeline, 
  SwapHoriz 
} from '@mui/icons-material';
import { AssetClass } from './types';

interface AssetClassSelectionProps {
  selectedAssets: AssetClass[];
  onChange: (assets: AssetClass[]) => void;
}

interface AssetOption {
  value: AssetClass;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

const assetOptions: AssetOption[] = [
  {
    value: 'stocks',
    label: 'Stocks',
    icon: <AttachMoney />,
    tooltip: 'Equities traded on stock exchanges'
  },
  {
    value: 'forex',
    label: 'Forex',
    icon: <AccountBalance />,
    tooltip: 'Foreign exchange currency pairs'
  },
  {
    value: 'crypto',
    label: 'Crypto',
    icon: <CurrencyBitcoin />,
    tooltip: 'Cryptocurrency markets'
  },
  {
    value: 'futures',
    label: 'Futures',
    icon: <Timeline />,
    tooltip: 'Futures contracts on commodities, indices, etc.'
  },
  {
    value: 'options',
    label: 'Options',
    icon: <SwapHoriz />,
    tooltip: 'Options contracts'
  }
];

const AssetClassSelection: React.FC<AssetClassSelectionProps> = ({ selectedAssets, onChange }) => {
  // Toggle asset selection
  const toggleAsset = (asset: AssetClass) => {
    if (selectedAssets.includes(asset)) {
      onChange(selectedAssets.filter(a => a !== asset));
    } else {
      onChange([...selectedAssets, asset]);
    }
  };

  return (
    <div className="asset-class-selection">
      <Typography variant="h6" sx={{ mb: 1 }}>Asset Classes</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Select the asset classes this strategy applies to
      </Typography>

      <div className="asset-classes-container">
        {assetOptions.map((option) => (
          <Tooltip key={option.value} title={option.tooltip}>
            <div
              className={`asset-class-chip ${selectedAssets.includes(option.value) ? 'selected' : ''}`}
              onClick={() => toggleAsset(option.value)}
            >
              {option.icon}
              {option.label}
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default AssetClassSelection; 