import { useState, useEffect } from "react";

import { 
  Button,  
  Box, 
  Typography,
} from "@mui/joy";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import TvIcon from "@mui/icons-material/Tv";
import remoteService from "../services/remoteService";
import { useSearchParams } from "react-router";

export default function RemoteControl() {
  const [searchParams] = useSearchParams();
  
  const [tvId, setTvId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isValidTvId, setIsValidTvId] = useState(null); // null = not checked, true = valid, false = invalid
  const [connectionError, setConnectionError] = useState('');
  const [tvState, setTvState] = useState({
    isOn: false,
    currentChannel: 1,
    currentCategory: 'All'
  });
  const [numInput, setNumInput] = useState("");
  const [inputTimer, setInputTimer] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const categories = ["All", "Entertainment", "Nature", "Animal", "Horror", "Romance", "2025 Wrapped"];
  
  useEffect(() => {
    const urlTvId = searchParams.get('tvId');
    const newSearchParams = new URLSearchParams(searchParams.toString());
    console.log("search param is", newSearchParams.getAll('tvId'));
    console.log("Direct tvId get:", urlTvId);
    
    if (urlTvId) {
      setTvId(urlTvId);
      console.log('Connected to TV:', urlTvId);
    } else {
      console.log('No TV ID found in URL parameters');
    }
  }, [searchParams]);

  useEffect(() => {
    // Auto-connect on component mount
    initializeConnection();

    return () => {
      remoteService.disconnect();
    };
  }, []);

  // Separate useEffect to handle TV ID validation after tvId is set
  useEffect(() => {
    if (tvId && isConnected) {
      console.log('Attempting to validate TV ID:', tvId);
      remoteService.validateTvId(tvId);
    } else {
      console.log('Cannot validate - missing tvId or not connected');
    }
  }, [tvId, isConnected]);

  const initializeConnection = async () => {
    setIsConnecting(true);
    setConnectionError('');
    
    try {
      await remoteService.connect();
      
      // Set up event listeners
      remoteService.on('connectionChange', (data) => {
        setIsConnected(data.isConnected);
        setIsConnecting(false);
      });

      remoteService.on('tvStateUpdate', (state) => {
        setTvState(state);
      });

      remoteService.on('tvIdValidation', (data) => {
        setIsValidTvId(data.isValid);
        if (!data.isValid) {
          setConnectionError(data.message || 'Invalid TV ID');
          setIsConnected(false);
        } else {
          setConnectionError('');
          console.log('TV ID validation successful!');
        }
      });

      remoteService.on('commandError', (error) => {
        setConnectionError(error.error || 'Command failed');
      });

      setIsConnected(remoteService.getConnectionStatus());
      setTvState(remoteService.getTvState());
      
      // Initial validation message if no TV ID
      if (!tvId) {
        setIsValidTvId(false);
        setConnectionError('No TV ID provided. Please scan QR code from TV.');
      }
    } catch (error) {
      console.error('Failed to connect to TV:', error);
      setIsConnected(false);
      setConnectionError('Failed to connect to server');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNumberInput = (number) => {
    const newInput = numInput + number.toString();
    
    // Limit to 3 digits
    if (newInput.length > 3) return;
    
    setNumInput(newInput);

    // Clear existing timer
    if (inputTimer) {
      clearTimeout(inputTimer);
    }

    // Set new timer to send channel after 2 seconds of inactivity
    const timer = setTimeout(() => {
      if (newInput) {
        if (tvState.currentCategory === "2025 Wrapped" && newInput < 18){
          setNumInput("");
          return;
        }
        remoteService.setChannel(parseInt(newInput), tvId);
        setNumInput("");
      }
    }, 2000);

    setInputTimer(timer);
  };

  const handlePowerToggle = () => {
    remoteService.togglePower(tvId);
  };

  const handleChannelUp = () => {
    remoteService.channelUp(tvId);
  };

  const handleChannelDown = () => {
    remoteService.channelDown(tvId);
  };

  const handleCategoryChange = (category) => {
    remoteService.setCategory(category, tvId);
  };

  const getConnectionStatusText = () => {
    if (isConnecting) return "Connecting...";
    if (connectionError) return connectionError;
    if (isValidTvId === false) return "Invalid or missing TV ID";
    if (isValidTvId === null) return "Validating TV ID...";
    return isConnected ? "Connected to TV" : "Disconnected";
  };

  const getConnectionColor = () => {
    if (isConnecting || isValidTvId === null) return "warning";
    if (connectionError || isValidTvId === false) return "danger";
    return isConnected && isValidTvId ? "success" : "neutral";
  };

  const isControlsDisabled = () => {
    console.log(isConnected, isValidTvId, isConnecting);
    
    return !isConnected || isValidTvId !== true || isConnecting;
  };

  // const handleBugReport = (bugReport) => {
  //   if (tvId) {
  //     remoteService.sendBugReport(tvId, bugReport);
  //   } else {
  //     console.error('Cannot send bug report - missing TV ID');
  //   }
  // };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* <Button onClick={() => handleBugReport("Sample bug report")}>Report Bug</Button> */}
      <Box 
        sx={{ 
          width: '100%',
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 4,
          justifyContent: 'center'
        }}>
          <Box sx={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TvIcon sx={{ color: 'white', fontSize: '1.8rem' }} />
          </Box>
          <Typography 
            level="h3" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}
          >
            TV Remote
          </Typography>
        </Box>
        
        {/* Connection Status */}
        <Box sx={{ 
          mb: 4,
          background: getConnectionColor() === 'success' 
            ? 'linear-gradient(90deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))'
            : getConnectionColor() === 'danger'
            ? 'linear-gradient(90deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))'
            : 'linear-gradient(90deg, rgba(255, 193, 7, 0.2), rgba(255, 193, 7, 0.1))',
          border: `1px solid ${
            getConnectionColor() === 'success' ? 'rgba(76, 175, 80, 0.3)' :
            getConnectionColor() === 'danger' ? 'rgba(244, 67, 54, 0.3)' :
            'rgba(255, 193, 7, 0.3)'
          }`,
          borderRadius: '16px',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {isConnected ? 
            <WifiIcon sx={{ color: '#4CAF50', fontSize: '1.5rem' }} /> : 
            <WifiOffIcon sx={{ color: '#F44336', fontSize: '1.5rem' }} />
          }
          <Box sx={{ flex: 1 }}>
            <Typography 
              level="body-sm" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              {getConnectionStatusText()}
            </Typography>
            {tvId && (
              <Typography 
                level="body-xs" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem'
                }}
              >
                TV ID: {tvId}
              </Typography>
            )}
          </Box>
        </Box>

        {/* TV State Display */}
        {isConnected && isValidTvId === true && (
          <Box sx={{ 
            mb: 4, 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            p: 2.5
          }}>
            <Typography 
              level="title-sm" 
              sx={{ 
                color: 'white',
                fontWeight: 600,
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📺 TV Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Power:
                </Typography>
                <Box sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '8px',
                  background: tvState.isOn 
                    ? 'linear-gradient(90deg, #4CAF50, #45a049)'
                    : 'linear-gradient(90deg, #757575, #616161)',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  <Typography level="body-xs" sx={{ color: 'white', fontWeight: 600 }}>
                    {tvState.isOn ? "ON" : "OFF"}
                  </Typography>
                </Box>
              </Box>
              {tvState.isOn && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Channel:
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'white', fontWeight: 600 }}>
                      {tvState.currentChannel}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography level="body-sm" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Category:
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'white', fontWeight: 600 }}>
                      {tvState.currentCategory}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}

        {/* Number Input Display */}
        {numInput && (
          <Box sx={{ 
            textAlign: "center", 
            mb: 3, 
            background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            p: 2.5
          }}>
            <Typography 
              level="h1" 
              sx={{ 
                color: 'white',
                fontWeight: 700,
                fontSize: '2.5rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}
            >
              {numInput}
              <span style={{ opacity: 0.4, fontSize: '2rem' }}>
                {"_".repeat(3 - numInput.length)}
              </span>
            </Typography>
          </Box>
        )}

        {/* Power Button */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            onClick={handlePowerToggle}
            disabled={isControlsDisabled()}
            sx={{ 
              borderRadius: "50%", 
              minWidth: 80, 
              height: 80,
              background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
              border: 'none',
              boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5252, #F44336)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)'
              },
              '&:active': {
                transform: 'translateY(0px)'
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                opacity: 0.5
              }
            }}
          >
            <PowerSettingsNewIcon sx={{ fontSize: '2.2rem', color: 'white' }} />
          </Button>
        </Box>

        {/* Number Pad */}
        <Typography 
          level="title-sm" 
          sx={{ 
            mb: 2, 
            color: 'white',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Channel Numbers
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 1.5, 
          mb: 4 
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outlined"
              onClick={() => handleNumberInput(num)}
              disabled={isControlsDisabled() || !tvState.isOn}
              sx={{ 
                aspectRatio: 1, 
                fontSize: '1.3rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0px)'
                },
                '&:disabled': {
                  opacity: 0.4
                }
              }}
            >
              {num}
            </Button>
          ))}
          <div></div>
          <Button
            variant="outlined"
            onClick={() => handleNumberInput(0)}
            disabled={isControlsDisabled() || !tvState.isOn}
            sx={{ 
              aspectRatio: 1, 
              fontSize: '1.3rem',
              fontWeight: 600,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-1px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
              },
              '&:active': {
                transform: 'translateY(0px)'
              },
              '&:disabled': {
                opacity: 0.4
              }
            }}
          >
            0
          </Button>
          <div></div>
        </Box>

        {/* Channel Up/Down */}
        <Typography 
          level="title-sm" 
          sx={{ 
            mb: 2, 
            color: 'white',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Channel Control
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            onClick={handleChannelUp}
            disabled={isControlsDisabled() || !tvState.isOn}
            sx={{ 
              minWidth: 100, 
              height: 60, 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.4), rgba(118, 75, 162, 0.4))',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(103, 126, 234, 0.3)'
              },
              '&:active': {
                transform: 'translateY(0px)'
              },
              '&:disabled': {
                opacity: 0.4
              }
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: '1.8rem' }} />
          </Button>
          <Button
            onClick={handleChannelDown}
            disabled={isControlsDisabled() || !tvState.isOn}
            sx={{ 
              minWidth: 100, 
              height: 60, 
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(103, 126, 234, 0.4), rgba(118, 75, 162, 0.4))',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(103, 126, 234, 0.3)'
              },
              '&:active': {
                transform: 'translateY(0px)'
              },
              '&:disabled': {
                opacity: 0.4
              }
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: '1.8rem' }} />
          </Button>
        </Box>

        {/* Categories */}
        <Typography 
          level="title-sm" 
          sx={{ 
            mb: 2, 
            color: 'white',
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Categories
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isControlsDisabled() || !tvState.isOn}
              sx={{ 
                fontSize: category === '2025 Wrapped' ? '0.9rem' : '0.8rem',
                fontWeight: category === '2025 Wrapped' ? 700 : 600,
                borderRadius: category === '2025 Wrapped' ? '16px' : '12px',
                py: category === '2025 Wrapped' ? 2 : 1.5,
                gridColumn: category === '2025 Wrapped' ? 'span 2' : 'auto',
                background: category === '2025 Wrapped'
                  ? (tvState.currentCategory === category
                    ? 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 25%, #4ECDC4 50%, #45B7D1 75%, #9B59B6 100%)'
                    : 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 107, 107, 0.3) 25%, rgba(78, 205, 196, 0.3) 50%, rgba(69, 183, 209, 0.3) 75%, rgba(155, 89, 182, 0.3) 100%)')
                  : (tvState.currentCategory === category 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)'
                    : 'rgba(255, 255, 255, 0.1)'),
                backdropFilter: 'blur(10px)',
                border: category === '2025 Wrapped'
                  ? (tvState.currentCategory === category
                    ? '2px solid rgba(255, 215, 0, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.4)')
                  : (tvState.currentCategory === category 
                    ? '1px solid rgba(103, 126, 234, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.2)'),
                color: 'white',
                textShadow: category === '2025 Wrapped' ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
                animation: category === '2025 Wrapped' && tvState.currentCategory === category 
                  ? 'pulse 2s ease-in-out infinite' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::before': category === '2025 Wrapped' ? {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  animation: 'shimmer 3s ease-in-out infinite',
                  zIndex: 1
                } : {},
                '&:hover': {
                  background: category === '2025 Wrapped'
                    ? (tvState.currentCategory === category
                      ? 'linear-gradient(135deg, #FFE55C 0%, #FF8A95 25%, #5BEFE5 50%, #52C8E8 75%, #B478D3 100%)'
                      : 'linear-gradient(135deg, rgba(255, 215, 0, 0.4) 0%, rgba(255, 107, 107, 0.4) 25%, rgba(78, 205, 196, 0.4) 50%, rgba(69, 183, 209, 0.4) 75%, rgba(155, 89, 182, 0.4) 100%)')
                    : (tvState.currentCategory === category 
                      ? 'linear-gradient(135deg, #5a67d8, #6b46c1)'
                      : 'rgba(255, 255, 255, 0.2)'),
                  transform: category === '2025 Wrapped' ? 'translateY(-2px) scale(1.02)' : 'translateY(-1px)',
                  boxShadow: category === '2025 Wrapped' 
                    ? '0 8px 25px rgba(255, 215, 0, 0.4), 0 0 20px rgba(255, 107, 107, 0.2)'
                    : '0 5px 15px rgba(0, 0, 0, 0.2)'
                },
                '&:active': {
                  transform: 'translateY(0px)'
                },
                '&:disabled': {
                  opacity: 0.4
                },
                '@keyframes pulse': {
                  '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
                  '50%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 107, 107, 0.3)' }
                },
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' }
                }
              }}
            >
              {category === '2025 Wrapped' ? '🎊 ' + category + ' ✨' : category}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}