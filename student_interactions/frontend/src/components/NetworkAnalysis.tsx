import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  AccountTree,
  Group,
  Hub,
  TrendingUp
} from '@mui/icons-material';

const NetworkAnalysis: React.FC = () => {
  // Mock network data
  const [networkStats] = useState({
    totalNodes: 25,
    totalEdges: 45,
    networkDensity: 0.36,
    avgClusteringCoeff: 0.42,
    numComponents: 2,
    centralStudents: [
      { id: 'STU_001', name: 'Alice Johnson', centrality: 0.85 },
      { id: 'STU_007', name: 'Grace Wilson', centrality: 0.78 },
      { id: 'STU_015', name: 'Mike Chen', centrality: 0.72 }
    ],
    communities: [
      { id: 1, size: 12, description: 'Study Group A' },
      { id: 2, size: 8, description: 'Lab Partners' },
      { id: 3, size: 5, description: 'Project Team' }
    ]
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Network Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Network Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Hub sx={{ mr: 1, verticalAlign: 'middle' }} />
                Network Metrics
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Network Density" 
                    secondary={`${(networkStats.networkDensity * 100).toFixed(1)}%`}
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Average Clustering Coefficient" 
                    secondary={networkStats.avgClusteringCoeff.toFixed(3)}
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Connected Components" 
                    secondary={networkStats.numComponents}
                  />
                </ListItem>
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Total Connections" 
                    secondary={`${networkStats.totalEdges} interactions`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Central Students */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Most Connected Students
              </Typography>
              
              <List>
                {networkStats.centralStudents.map((student, index) => (
                  <React.Fragment key={student.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Chip 
                          label={`#${index + 1}`} 
                          size="small" 
                          color="primary"
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={student.name}
                        secondary={`Centrality: ${(student.centrality * 100).toFixed(0)}%`}
                      />
                    </ListItem>
                    {index < networkStats.centralStudents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Communities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detected Communities
              </Typography>
              
              <List>
                {networkStats.communities.map((community, index) => (
                  <React.Fragment key={community.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Chip 
                          label={community.size} 
                          size="small" 
                          color="secondary"
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={community.description}
                        secondary={`${community.size} students`}
                      />
                    </ListItem>
                    {index < networkStats.communities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Network Visualization Placeholder */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AccountTree sx={{ mr: 1, verticalAlign: 'middle' }} />
                Network Visualization
              </Typography>
              
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  border: '1px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Network graph will be rendered here using D3.js
                  <br />
                  (Interactive force-directed layout)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NetworkAnalysis;