import React from 'react';
import { Route, Switch } from 'wouter';
import { CssBaseline } from '@mui/material';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { JournalingCalendar } from './pages/JournalingCalendar';
import { TradeHistory } from './pages/TradeHistory';
import { Reports } from './pages/Reports';
import { Strategies } from './pages/Strategies';
import { TradingSimulator } from './pages/TradingSimulator';
import { Education } from './pages/Education';
import { Support } from './pages/Support';
import { SyncHoverProvider } from './hooks/useSyncHover';
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <SyncHoverProvider>
        <AppLayout key="app-layout">
          <Switch>
            <Route path="/" component={DashboardScreen} />
            <Route path="/dashboard" component={DashboardScreen} />
            <Route path="/calendar" component={JournalingCalendar} />
            <Route path="/history" component={TradeHistory} />
            <Route path="/reports" component={Reports} />
            <Route path="/strategies" component={Strategies} />
            <Route path="/simulator" component={TradingSimulator} />
            <Route path="/education" component={Education} />
            <Route path="/support" component={Support} />
            <Route>404: Page Not Found</Route>
          </Switch>
        </AppLayout>
      </SyncHoverProvider>
    </ThemeProvider>
  );
}

export default App;
