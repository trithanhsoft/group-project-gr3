import { beforeEach, describe, expect, it, vi } from "vitest";
import * as matchingService from "@/modules/player-matching/player-matching.service";
import * as matchingRepo from "@/modules/player-matching/player-matching.repository";
import * as playgroupsService from "@/modules/playgroups/playgroups.service";
import * as playgroupsRepo from "@/modules/playgroups/playgroups.repository";
import * as notificationsService from "@/modules/notifications/notifications.service";

vi.mock("@/modules/player-matching/player-matching.repository", () => ({
  findProfileByUserId: vi.fn(),
  updateProfile: vi.fn(),
  createProfile: vi.fn(),
  findAllMatchingProfiles: vi.fn(),
  createPlayerMatch: vi.fn(),
  findUserGroups: vi.fn(),
  findAllOtherActiveGroups: vi.fn(),
  upsertPlayerMatch: vi.fn(),
}));

vi.mock("@/modules/playgroups/playgroups.repository", () => ({
  countActiveGroupsForCreator: vi.fn(),
  createGroup: vi.fn(),
  listGroups: vi.fn(),
  getGroupDetails: vi.fn(),
  checkUserInGroup: vi.fn(),
  addGroupMember: vi.fn(),
  updateGroupStatus: vi.fn(),
  removeGroupMember: vi.fn(),
  updateGroup: vi.fn(),
  getGroupMessages: vi.fn(),
  createGroupMessage: vi.fn(),
  getUnreadCounts: vi.fn(),
  markMessagesAsRead: vi.fn(),
  countActiveGroupMembers: vi.fn(),
  findActiveGroupBetweenPlayers: vi.fn(),
  checkGroupOverlap: vi.fn(),
}));

vi.mock("@/modules/notifications/notifications.service", () => ({
  notifyGroupChatMessage: vi.fn().mockResolvedValue(undefined),
}));

describe("Extended Matching and Playgroup Tests", () => {
  const baseProfile = {
    UserID: 1,
    FullName: "Player One",
    PlayingRole: "attacker",
    SkillLevel: "Intermediate",
    ExperienceYears: 2,
    AvailableStartTime: "08:00",
    AvailableEndTime: "11:00",
    Rating: 4.8,
  };

  const leaderGroup = {
    GroupID: 10,
    CreatorID: 1,
    GroupName: "Morning Team",
    Status: "Open",
    CurrentPlayers: 2,
    MaxPlayers: 4,
    members: [
      { UserID: 1, RoleInGroup: "Leader", MemberStatus: "Active", SkillLevel: "Intermediate", ExperienceYears: 2, Rating: 4.8, AvailableStartTime: "08:00", AvailableEndTime: "11:00" },
      { UserID: 2, RoleInGroup: "Member", MemberStatus: "Active", SkillLevel: "Advanced", ExperienceYears: 3, Rating: 4.6, AvailableStartTime: "08:30", AvailableEndTime: "10:30" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("matching score helpers", () => {
    it.each([
      ["attacker", "defender", 100],
      ["defender", "attacker", 100],
      ["attacker", "all-rounder", 75],
      ["all-rounder", "defender", 75],
      ["attacker", "attacker", 30],
      ["", "defender", 0],
      ["unknown", "defender", 0],
    ])("TC_MATCH_ROLE_%#: scores role pair %s/%s", (a, b, expected) => {
      expect(matchingService.calculateRoleScore(a, b)).toBe(expected);
    });

    it.each([
      ["Beginner", "Beginner", 100],
      ["Beginner", "Intermediate", 75],
      ["Beginner", "Advanced", 50],
      ["Beginner", "Professional", 25],
      ["Intermediate", "Professional", 50],
      ["Elite", "Beginner", 100],
      ["", "Advanced", 50],
    ])("TC_MATCH_SKILL_%#: scores skill pair %s/%s", (a, b, expected) => {
      expect(matchingService.calculateSkillScore(a, b)).toBe(expected);
    });

    it.each([
      [0, 0, 100],
      [1, 3, 80],
      [2, 7, 50],
      [0, 11, 0],
      [10, 0, 0],
    ])("TC_MATCH_EXP_%#: scores experience pair %s/%s", (a, b, expected) => {
      expect(matchingService.calculateExperienceScore(a, b)).toBe(expected);
    });

    it.each([
      ["08:00", "10:00", "08:30", "11:00", 100],
      ["08:00", "09:30", "08:30", "11:00", 70],
      ["08:00", "09:00", "08:45", "11:00", 0],
      ["08:00:00", "10:00:00", "09:00:00", "10:30:00", 70],
      [new Date("2026-01-01T08:00:00Z"), new Date("2026-01-01T10:00:00Z"), "08:30", "10:00", 100],
      [null, "10:00", "08:30", "10:00", 0],
      ["bad", "10:00", "08:30", "10:00", 0],
    ])("TC_MATCH_SCHEDULE_%#: scores schedule overlap", (a, b, c, d, expected) => {
      expect(matchingService.calculateScheduleScore(a, b, c, d)).toBe(expected);
    });
  });

  describe("player profile and teammate search", () => {
    it("TC_MATCH_PROFILE_001: returns player profile by user id", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);

      await expect(matchingService.getPlayerProfile(1)).resolves.toEqual(baseProfile);
    });

    it("TC_MATCH_PROFILE_002: updates existing profile", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);
      vi.mocked(matchingRepo.updateProfile).mockResolvedValue({ ...baseProfile, SkillLevel: "Advanced" } as any);

      const result = await matchingService.savePlayerProfile(1, { SkillLevel: "Advanced" } as any);

      expect(result.SkillLevel).toBe("Advanced");
      expect(matchingRepo.updateProfile).toHaveBeenCalledWith(1, { SkillLevel: "Advanced" });
    });

    it("TC_MATCH_PROFILE_003: creates profile when it does not exist", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(null as any);
      vi.mocked(matchingRepo.createProfile).mockResolvedValue({ ...baseProfile, UserID: 3 } as any);

      const result = await matchingService.savePlayerProfile(3, { SkillLevel: "Beginner" } as any);

      expect(result.UserID).toBe(3);
      expect(matchingRepo.createProfile).toHaveBeenCalledWith(3, { SkillLevel: "Beginner" });
    });

    it("TC_MATCH_TEAMMATE_001: rejects teammate search when profile is incomplete", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue({ ...baseProfile, AvailableStartTime: null } as any);

      await expect(matchingService.findSuitableTeammates(1)).rejects.toThrow();
    });

    it("TC_MATCH_TEAMMATE_002: returns sorted teammates and logs high-score matches", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);
      vi.mocked(matchingRepo.findAllMatchingProfiles).mockResolvedValue([
        { ...baseProfile, UserID: 2, FullName: "Strong Defender", PlayingRole: "defender", SkillLevel: "Intermediate", ExperienceYears: 2, AvailableStartTime: "08:30", AvailableEndTime: "10:30" },
        { ...baseProfile, UserID: 3, FullName: "Weak Match", PlayingRole: "attacker", SkillLevel: "Professional", ExperienceYears: 10, AvailableStartTime: "14:00", AvailableEndTime: "15:00" },
      ] as any);
      vi.mocked(matchingRepo.createPlayerMatch).mockResolvedValue(undefined as any);

      const result = await matchingService.findSuitableTeammates(1);

      expect(result[0].profile.UserID).toBe(2);
      expect(result[0].matchingScore).toBeGreaterThan(result[1].matchingScore);
      expect(matchingRepo.createPlayerMatch).toHaveBeenCalled();
    });

    it("TC_MATCH_GROUPS_001: returns active groups for user", async () => {
      vi.mocked(matchingRepo.findUserGroups).mockResolvedValue([leaderGroup] as any);

      await expect(matchingService.getUserActiveGroups(1)).resolves.toEqual([leaderGroup]);
    });
  });

  describe("opponent search", () => {
    it("TC_MATCH_OPP_001: rejects when group does not exist", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(null as any);

      await expect(matchingService.findSuitableOpponents(1, 10)).rejects.toThrow();
    });

    it("TC_MATCH_OPP_002: rejects when user is not group member", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue({ ...leaderGroup, members: [] } as any);

      await expect(matchingService.findSuitableOpponents(99, 10)).rejects.toThrow();
    });

    it("TC_MATCH_OPP_003: rejects when current group has fewer than two active members", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);
      vi.mocked(playgroupsRepo.countActiveGroupMembers).mockResolvedValue(1);

      await expect(matchingService.findSuitableOpponents(1, 10)).rejects.toThrow();
    });

    it("TC_MATCH_OPP_004: filters invalid opponent groups and sorts valid opponents", async () => {
      const opponentGroup = {
        ...leaderGroup,
        GroupID: 11,
        CreatorID: 3,
        members: [
          { UserID: 3, RoleInGroup: "Leader", MemberStatus: "Active", SkillLevel: "Intermediate", ExperienceYears: 2, Rating: 4.7, AvailableStartTime: "08:00", AvailableEndTime: "10:00" },
          { UserID: 4, RoleInGroup: "Member", MemberStatus: "Active", SkillLevel: "Intermediate", ExperienceYears: 2, Rating: 4.5, AvailableStartTime: "08:30", AvailableEndTime: "10:30" },
        ],
      };
      vi.mocked(playgroupsRepo.getGroupDetails)
        .mockResolvedValueOnce(leaderGroup as any)
        .mockResolvedValueOnce(leaderGroup as any)
        .mockResolvedValueOnce(opponentGroup as any)
        .mockResolvedValueOnce(opponentGroup as any)
        .mockResolvedValueOnce(null as any);
      vi.mocked(playgroupsRepo.countActiveGroupMembers)
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(2);
      vi.mocked(matchingRepo.findAllOtherActiveGroups).mockResolvedValue([11, 12] as any);

      const result = await matchingService.findSuitableOpponents(1, 10);

      expect(result).toHaveLength(1);
      expect(result[0].group.GroupID).toBe(11);
    });
  });

  describe("playgroup lifecycle", () => {
    it("TC_GROUP_CREATE_001: rejects group creation without player profile", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(null as any);

      await expect(playgroupsService.createPlayGroup({ groupName: "A" } as any, 1)).rejects.toThrow();
    });

    it("TC_GROUP_CREATE_002: rejects group creation when creator already owns three active groups", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);
      vi.mocked(playgroupsRepo.countActiveGroupsForCreator).mockResolvedValue(3);

      await expect(playgroupsService.createPlayGroup({ groupName: "A" } as any, 1)).rejects.toThrow();
    });

    it("TC_GROUP_CREATE_003: creates group and returns details", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);
      vi.mocked(playgroupsRepo.countActiveGroupsForCreator).mockResolvedValue(0);
      vi.mocked(playgroupsRepo.createGroup).mockResolvedValue(10 as any);
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);

      await expect(playgroupsService.createPlayGroup({ groupName: "A" } as any, 1)).resolves.toEqual(leaderGroup);
    });

    it("TC_GROUP_LIST_001: returns filtered playgroups", async () => {
      vi.mocked(playgroupsRepo.listGroups).mockResolvedValue([leaderGroup] as any);

      await expect(playgroupsService.getPlayGroups({ skillLevel: "Intermediate" })).resolves.toEqual([leaderGroup]);
    });

    it("TC_GROUP_DETAIL_001: rejects missing group details", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(null as any);

      await expect(playgroupsService.getPlayGroupDetails(404)).rejects.toThrow();
    });

    it("TC_GROUP_DETAIL_002: returns group details", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);

      await expect(playgroupsService.getPlayGroupDetails(10)).resolves.toEqual(leaderGroup);
    });
  });

  describe("playgroup membership", () => {
    it.each([
      ["missing profile", null, leaderGroup, false],
      ["missing group", baseProfile, null, false],
      ["closed group", baseProfile, { ...leaderGroup, Status: "Closed" }, false],
      ["full group", baseProfile, { ...leaderGroup, CurrentPlayers: 4, MaxPlayers: 4 }, false],
      ["duplicate member", baseProfile, leaderGroup, true],
    ])("TC_GROUP_JOIN_ERR_%#: rejects join for %s", async (_label, profile, group, isMember) => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(profile as any);
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(group as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(isMember);

      await expect(playgroupsService.joinPlayGroup(10, 2)).rejects.toThrow();
    });

    it("TC_GROUP_JOIN_001: adds member and returns updated group", async () => {
      vi.mocked(matchingRepo.findProfileByUserId).mockResolvedValue(baseProfile as any);
      vi.mocked(playgroupsRepo.getGroupDetails)
        .mockResolvedValueOnce({ ...leaderGroup, CurrentPlayers: 2, MaxPlayers: 4 } as any)
        .mockResolvedValueOnce({ ...leaderGroup, CurrentPlayers: 3 } as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(false);

      const result = await playgroupsService.joinPlayGroup(10, 3);

      expect(result.CurrentPlayers).toBe(3);
      expect(playgroupsRepo.addGroupMember).toHaveBeenCalledWith(10, 3);
    });

    it("TC_GROUP_LEAVE_001: rejects non-member leave", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(false);

      await expect(playgroupsService.leavePlayGroup(10, 3)).rejects.toThrow();
    });

    it("TC_GROUP_LEAVE_002: prevents leader leaving while active members remain", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);

      await expect(playgroupsService.leavePlayGroup(10, 1)).rejects.toThrow();
    });

    it("TC_GROUP_LEAVE_003: closes group when solo leader leaves", async () => {
      const soloGroup = { ...leaderGroup, members: [{ UserID: 1, RoleInGroup: "Leader", MemberStatus: "Active" }] };
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(soloGroup as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);

      const result = await playgroupsService.leavePlayGroup(10, 1);

      expect(result.status).toBe("Closed");
      expect(playgroupsRepo.updateGroupStatus).toHaveBeenCalledWith(10, "Closed");
    });

    it("TC_GROUP_LEAVE_004: removes regular member and returns updated group", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails)
        .mockResolvedValueOnce(leaderGroup as any)
        .mockResolvedValueOnce({ ...leaderGroup, CurrentPlayers: 1 } as any);
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);

      const result = await playgroupsService.leavePlayGroup(10, 2);

      expect(result.CurrentPlayers).toBe(1);
      expect(playgroupsRepo.removeGroupMember).toHaveBeenCalledWith(10, 2);
    });
  });

  describe("playgroup management and chat", () => {
    it("TC_GROUP_CLOSE_001: rejects close by non-owner", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(leaderGroup as any);

      await expect(playgroupsService.closePlayGroup(10, 99)).rejects.toThrow();
    });

    it("TC_GROUP_CLOSE_002: closes group by owner", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails)
        .mockResolvedValueOnce(leaderGroup as any)
        .mockResolvedValueOnce({ ...leaderGroup, Status: "Closed" } as any);

      await expect(playgroupsService.closePlayGroup(10, 1)).resolves.toMatchObject({ Status: "Closed" });
    });

    it.each([
      [{ ...leaderGroup, CreatorID: 99 }, { groupName: "A", skillLevel: "Intermediate", averageExperience: 1, description: "", status: "Open" }, "not owner"],
      [leaderGroup, { groupName: "", skillLevel: "Intermediate", averageExperience: 1, description: "", status: "Open" }, "empty name"],
      [leaderGroup, { groupName: "A", skillLevel: "Elite", averageExperience: 1, description: "", status: "Open" }, "invalid skill"],
      [leaderGroup, { groupName: "A", skillLevel: "Intermediate", averageExperience: -1, description: "", status: "Open" }, "invalid experience"],
      [leaderGroup, { groupName: "A", skillLevel: "Intermediate", averageExperience: 1, description: "", status: "Archived" }, "invalid status"],
    ])("TC_GROUP_UPDATE_ERR_%#: rejects update for %s", async (group, payload) => {
      vi.mocked(playgroupsRepo.getGroupDetails).mockResolvedValue(group as any);

      await expect(playgroupsService.updatePlayGroup(10, 1, payload as any)).rejects.toThrow();
    });

    it("TC_GROUP_UPDATE_001: updates group when owner submits valid data", async () => {
      vi.mocked(playgroupsRepo.getGroupDetails)
        .mockResolvedValueOnce(leaderGroup as any)
        .mockResolvedValueOnce({ ...leaderGroup, GroupName: "New Name" } as any);

      const result = await playgroupsService.updatePlayGroup(10, 1, {
        groupName: " New Name ",
        skillLevel: "Advanced",
        averageExperience: 3,
        description: "Ready",
        status: "Active",
      });

      expect(result.GroupName).toBe("New Name");
      expect(playgroupsRepo.updateGroup).toHaveBeenCalledWith(10, expect.objectContaining({ groupName: "New Name" }));
    });

    it("TC_GROUP_MSG_001: rejects reading messages by non-member", async () => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(false);

      await expect(playgroupsService.getGroupMessages(10, 99)).rejects.toThrow();
    });

    it("TC_GROUP_MSG_002: marks own messages in returned list", async () => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);
      vi.mocked(playgroupsRepo.getGroupMessages).mockResolvedValue([
        { MessageID: 1, SenderID: 1, Content: "Mine" },
        { MessageID: 2, SenderID: 2, Content: "Other" },
      ] as any);

      const result = await playgroupsService.getGroupMessages(10, 1);

      expect(result.map((m: any) => m.IsMine)).toEqual([true, false]);
    });

    it.each([
      ["", "empty"],
      ["   ", "blank"],
      ["x".repeat(1001), "too long"],
    ])("TC_GROUP_MSG_ERR_%#: rejects %s message", async (content) => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);

      await expect(playgroupsService.sendGroupMessage(10, 1, content)).rejects.toThrow();
    });

    it("TC_GROUP_MSG_003: sends group message and notifies members", async () => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);
      vi.mocked(playgroupsRepo.createGroupMessage).mockResolvedValue({ MessageID: 1, SenderID: 1, Content: "Hello" } as any);

      const result = await playgroupsService.sendGroupMessage(10, 1, "  Hello  ");

      expect(result.IsMine).toBe(true);
      expect(playgroupsRepo.createGroupMessage).toHaveBeenCalledWith(10, 1, "Hello");
      expect(notificationsService.notifyGroupChatMessage).toHaveBeenCalledWith(1, 10, "Hello");
    });

    it("TC_GROUP_UNREAD_001: returns unread counts", async () => {
      vi.mocked(playgroupsRepo.getUnreadCounts).mockResolvedValue([{ GroupID: 10, UnreadCount: 2 }] as any);

      await expect(playgroupsService.getUnreadCounts(1)).resolves.toEqual([{ GroupID: 10, UnreadCount: 2 }]);
    });

    it("TC_GROUP_READ_001: rejects mark read by non-member", async () => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(false);

      await expect(playgroupsService.markMessagesAsRead(1, 10)).rejects.toThrow();
    });

    it("TC_GROUP_READ_002: marks messages as read for group member", async () => {
      vi.mocked(playgroupsRepo.checkUserInGroup).mockResolvedValue(true);
      vi.mocked(playgroupsRepo.markMessagesAsRead).mockResolvedValue({ updated: 3 } as any);

      await expect(playgroupsService.markMessagesAsRead(1, 10)).resolves.toEqual({ updated: 3 });
    });
  });
});
