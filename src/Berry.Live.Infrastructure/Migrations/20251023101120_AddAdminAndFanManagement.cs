using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Berry.Live.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminAndFanManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "LiveRooms",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LiveRooms_UserId",
                table: "LiveRooms",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LiveRooms_Users_UserId",
                table: "LiveRooms",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LiveRooms_Users_UserId",
                table: "LiveRooms");

            migrationBuilder.DropIndex(
                name: "IX_LiveRooms_UserId",
                table: "LiveRooms");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LiveRooms");
        }
    }
}
