using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Berry.Live.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLiveRoom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LiveRooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: true),
                    OwnerId = table.Column<int>(type: "INTEGER", nullable: false),
                    CoverUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Category = table.Column<string>(type: "TEXT", maxLength: 50, nullable: true),
                    IsLive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    ViewerCount = table.Column<int>(type: "INTEGER", nullable: false),
                    StreamKey = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LiveRooms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LiveRooms_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LiveRooms_OwnerId",
                table: "LiveRooms",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_LiveRooms_StreamKey",
                table: "LiveRooms",
                column: "StreamKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LiveRooms");
        }
    }
}
