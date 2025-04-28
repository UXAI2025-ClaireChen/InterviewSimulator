import React, { useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Badge,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

/**
 * Progress summary component showing performance trends
 * Basic version without recharts dependency
 */
const ProgressSummary = ({ history = {} }) => { // Added default empty object
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700');
  
  // Process history data for stats
  const processedData = useMemo(() => {
    // If no history, return empty data
    if (!history || Object.keys(history).length === 0) {
      return {
        topicStats: {},
        chartData: [],
        overallAverage: 0,
        totalEntries: 0,
        bestTopic: null,
        improvement: 0,
      };
    }
    
    const chartData = [];
    const topicStats = {};
    let totalSum = 0;
    let totalCount = 0;
    
    // Process each topic
    Object.entries(history).forEach(([topic, dates]) => {
      let topicSum = 0;
      let topicCount = 0;
      let firstScore = null;
      let lastScore = null;
      
      // Process dates chronologically
      const sortedDates = Object.keys(dates).sort((a, b) => new Date(a) - new Date(b));
      
      sortedDates.forEach(dateKey => {
        const entries = dates[dateKey] || [];
        
        // Process each entry
        entries.forEach(entry => {
          totalSum += entry.score;
          totalCount++;
          
          topicSum += entry.score;
          topicCount++;
          
          // Track first and last scores for improvement calculation
          if (firstScore === null) firstScore = entry.score;
          lastScore = entry.score;
          
          // Add to chart data
          chartData.push({
            date: new Date(entry.id).toLocaleDateString(),
            score: entry.score,
            topic,
          });
        });
      });
      
      // Calculate topic stats
      topicStats[topic] = {
        average: topicCount > 0 ? Math.round(topicSum / topicCount) : 0,
        count: topicCount,
        improvement: firstScore !== null && lastScore !== null ? lastScore - firstScore : 0,
      };
    });
    
    // Find best topic
    let bestTopic = null;
    let bestTopicAvg = 0;
    
    Object.entries(topicStats).forEach(([topic, stats]) => {
      if (stats.average > bestTopicAvg) {
        bestTopicAvg = stats.average;
        bestTopic = topic;
      }
    });
    
    // Calculate overall stats
    const overallAverage = totalCount > 0 ? Math.round(totalSum / totalCount) : 0;
    
    // Sort chart data by date
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate overall improvement
    const improvement = chartData.length >= 2 ? 
      chartData[chartData.length - 1].score - chartData[0].score : 0;
    
    return {
      topicStats,
      chartData,
      overallAverage,
      totalEntries: totalCount,
      bestTopic,
      improvement,
    };
  }, [history]);
  
  // If no history data, show placeholder
  if (!history || Object.keys(history).length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md" mb={4}>No Practice History Yet</Heading>
        <Text>
          Start practicing questions and save your results to see your progress here.
        </Text>
      </Box>
    );
  }
  
  // Calculate performance status
  const getPerformanceStatus = (improvement) => {
    if (improvement > 10) return { label: 'Improving', color: 'green' };
    if (improvement > 0) return { label: 'Slightly Improving', color: 'teal' };
    if (improvement === 0) return { label: 'Stable', color: 'blue' };
    if (improvement > -10) return { label: 'Slightly Declining', color: 'yellow' };
    return { label: 'Needs Work', color: 'red' };
  };
  
  const performanceStatus = getPerformanceStatus(processedData.improvement);
  
  return (
    <Box>
      <Heading size="lg" mb={6}>Your Progress Summary</Heading>
      
      {/* Performance Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Overall Average</StatLabel>
              <StatNumber>{processedData.overallAverage}</StatNumber>
              <StatHelpText>
                From {processedData.totalEntries} practice sessions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Performance Trend</StatLabel>
              <Flex align="center" mt={1}>
                <StatNumber>{processedData.improvement > 0 ? '+' : ''}{processedData.improvement}</StatNumber>
                <Badge colorScheme={performanceStatus.color} ml={2}>
                  {performanceStatus.label}
                </Badge>
              </Flex>
              <StatHelpText>
                Points change since first practice
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Best Topic</StatLabel>
              <StatNumber>
                {processedData.bestTopic ? processedData.bestTopic : 'N/A'}
              </StatNumber>
              <StatHelpText>
                {processedData.bestTopic ? 
                  `Average score: ${processedData.topicStats[processedData.bestTopic].average}` : 
                  'Practice more to see your best topic'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      {/* Basic Score History - Text based since recharts is not available */}
      <Card bg={cardBg} mb={8}>
        <CardBody>
          <Heading size="md" mb={4}>Score History</Heading>
          <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            {processedData.chartData.length === 0 ? (
              <Text textAlign="center">No data available yet</Text>
            ) : (
              <VStack spacing={2} align="stretch">
                <Flex justify="space-between" fontWeight="bold">
                  <Box width="30%">Date</Box>
                  <Box width="40%">Topic</Box>
                  <Box width="30%">Score</Box>
                </Flex>
                {processedData.chartData.slice(-10).map((entry, index) => (
                  <Flex key={index} justify="space-between" py={2} borderBottomWidth={index < processedData.chartData.length - 1 ? "1px" : "0"}>
                    <Box width="30%">{entry.date}</Box>
                    <Box width="40%" fontWeight="medium">{entry.topic}</Box>
                    <Box width="30%">
                      <Badge colorScheme={entry.score >= 80 ? 'green' : entry.score >= 60 ? 'yellow' : 'red'}>
                        {entry.score}
                      </Badge>
                    </Box>
                  </Flex>
                ))}
              </VStack>
            )}
            {processedData.chartData.length > 10 && (
              <Text fontSize="sm" textAlign="center" mt={2} color="gray.500">
                Showing the 10 most recent entries
              </Text>
            )}
          </Box>
        </CardBody>
      </Card>
      
      {/* Topic Breakdown */}
      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Topic Breakdown</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {Object.entries(processedData.topicStats).map(([topic, stats]) => (
              <Box 
                key={topic} 
                p={4} 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor="gray.200"
              >
                <Flex justify="space-between" align="center">
                  <Text fontWeight="medium">{topic}</Text>
                  <Badge 
                    colorScheme={stats.average >= 80 ? 'green' : stats.average >= 60 ? 'yellow' : 'red'}
                    variant="solid"
                  >
                    Avg: {stats.average}
                  </Badge>
                </Flex>
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="sm" color="gray.500">Sessions: {stats.count}</Text>
                  <Text fontSize="sm" color="gray.500">
                    Change: {stats.improvement > 0 ? '+' : ''}{stats.improvement}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ProgressSummary;