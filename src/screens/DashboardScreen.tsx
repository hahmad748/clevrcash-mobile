import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {apiService} from '../services/api';
import {getBrandConfig} from '../config/brand';

export default function DashboardScreen({navigation}: any) {
  const {user} = useAuth();
  const {colors} = useTheme();
  const brand = getBrandConfig();
  const [totalBalance, setTotalBalance] = useState(0);
  const [groups, setGroups] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [balanceRes, groupsRes, friendsRes] = await Promise.all([
        apiService.get('/balances/total'),
        apiService.get('/groups'),
        apiService.get('/friends'),
      ]);

      setTotalBalance(balanceRes.data?.balance || 0);
      setGroups(groupsRes.data || []);
      setFriends(friendsRes.data || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: user?.default_currency || 'USD',
    }).format(amount);
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.content}>
        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            {
              borderLeftColor: brand.primaryColor,
              backgroundColor: colors.surface,
            },
          ]}>
          <Text style={[styles.balanceLabel, {color: colors.textSecondary}]}>
            Total Balance
          </Text>
          <Text
            style={[
              styles.balanceAmount,
              {color: totalBalance >= 0 ? brand.primaryColor : '#f44336'},
            ]}>
            {formatCurrency(totalBalance)}
          </Text>
          <Text style={[styles.balanceSubtext, {color: colors.textSecondary}]}>
            {totalBalance >= 0
              ? 'You are owed this amount'
              : 'You owe this amount'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Quick Actions
          </Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: brand.primaryColor}]}
              onPress={() => navigation.navigate('Expenses', {action: 'add'})}>
              <Text style={styles.actionIcon}>➕</Text>
              <Text style={styles.actionLabel}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: brand.primaryColor}]}
              onPress={() => navigation.navigate('Groups', {action: 'create'})}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionLabel}>New Group</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              Recent Groups
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
              <Text style={[styles.seeAll, {color: brand.primaryColor}]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {groups.length > 0 ? (
            groups.slice(0, 3).map((group: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.groupItem,
                  {backgroundColor: colors.surface, borderColor: colors.border},
                ]}
                onPress={() =>
                  navigation.navigate('GroupDetail', {groupId: group.id})
                }>
                <View style={styles.groupInfo}>
                  <Text style={[styles.groupName, {color: colors.text}]}>
                    {group.name}
                  </Text>
                  <Text style={[styles.groupMembers, {color: colors.textSecondary}]}>
                    {group.members?.length || 0} members
                  </Text>
                </View>
                <Text style={[styles.groupArrow, {color: colors.textSecondary}]}>
                  ›
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No groups yet
            </Text>
          )}
        </View>

        {/* Friends */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>Friends</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Friends')}>
              <Text style={[styles.seeAll, {color: brand.primaryColor}]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          {friends.length > 0 ? (
            friends.slice(0, 3).map((friend: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.friendItem,
                  {backgroundColor: colors.surface, borderColor: colors.border},
                ]}>
                <View style={[styles.friendAvatar, {backgroundColor: colors.border}]}>
                  <Text style={[styles.friendAvatarText, {color: colors.text}]}>
                    {friend.name?.charAt(0)?.toUpperCase() || 'F'}
                  </Text>
                </View>
                <View style={styles.friendInfo}>
                  <Text style={[styles.friendName, {color: colors.text}]}>
                    {friend.name}
                  </Text>
                  <Text style={[styles.friendEmail, {color: colors.textSecondary}]}>
                    {friend.email}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
              No friends yet
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  balanceCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  groupItem: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
  },
  groupArrow: {
    fontSize: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  friendAvatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 14,
  },
});
