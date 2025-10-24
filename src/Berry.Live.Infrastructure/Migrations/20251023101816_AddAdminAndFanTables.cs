using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Berry.Live.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminAndFanTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LiveRoomAdmins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LiveRoomId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    AddedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AddedByUserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiveRoomAdmins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiveRoomAdmins_LiveRooms_LiveRoomId",
                        column: x => x.LiveRoomId,
                        principalTable: "LiveRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LiveRoomAdmins_Users_AddedByUserId",
                        column: x => x.AddedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LiveRoomAdmins_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LiveRoomFans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    LiveRoomId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    FollowedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiveRoomFans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiveRoomFans_LiveRooms_LiveRoomId",
                        column: x => x.LiveRoomId,
                        principalTable: "LiveRooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LiveRoomFans_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LiveRoomAdmins_AddedByUserId",
                table: "LiveRoomAdmins",
                column: "AddedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LiveRoomAdmins_LiveRoomId_UserId",
                table: "LiveRoomAdmins",
                columns: new[] { "LiveRoomId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LiveRoomAdmins_UserId",
                table: "LiveRoomAdmins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LiveRoomFans_LiveRoomId_UserId",
                table: "LiveRoomFans",
                columns: new[] { "LiveRoomId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LiveRoomFans_UserId",
                table: "LiveRoomFans",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LiveRoomAdmins");

            migrationBuilder.DropTable(
                name: "LiveRoomFans");
        }
    }
}
